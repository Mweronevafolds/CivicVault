import { supabase } from '../config/client';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

/**
 * Uploads an image file to the 'registrations' bucket in Supabase Storage.
 *
 * @param {string} imageUri The local URI of the image file on the device.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export const uploadImage = async (imageUri) => {
  try {
    // Read the image from the device's storage into a base64 string
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Get the current user from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated.");

    // Create a unique file path for the image, including the user's ID
    const filePath = `${user.id}/${new Date().getTime()}.jpg`;
    const contentType = 'image/jpeg';

    // Upload the image to the 'registrations' bucket in Supabase
    const { data, error } = await supabase.storage
      .from('registrations')
      .upload(filePath, decode(base64), { contentType });

    if (error) {
      throw error;
    }

    // If the upload is successful, get the public URL for the image
    const { data: { publicUrl } } = supabase.storage
      .from('registrations')
      .getPublicUrl(data.path);

    console.log('Image uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    // Re-throw the error so the form screen can catch it and show an alert
    throw new Error('Image upload failed: ' + error.message);
  }
};

/**
 * Inserts a new submission record into the 'submissions' table in Supabase.
 *
 * @param {object} submissionData The complete data object for the submission.
 * @returns {Promise<object>} The data returned from the database after insertion.
 */
export const createSubmission = async (submissionData) => {
  try {
    // Get the current user from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated.");

    // Add the user ID to the data before inserting
    const completeData = { ...submissionData, user_id: user.id };

    const { data, error } = await supabase
      .from('submissions')
      .insert([completeData])
      .select();

    if (error) throw error;
    
    console.log('Database record created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating submission:', error);
    throw new Error('Database submission failed: ' + error.message);
  }
};

/**
 * Fetches all submissions for the currently logged-in user.
 * @returns {Promise<Array>} A list of the user's submissions.
 */
export const getUserSubmissions = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user is logged in.');

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    throw new Error('Could not fetch your submissions: ' + error.message);
  }
};

/**
 * Fetches all submissions to be displayed on the public community map.
 * @returns {Promise<Array>} A list of all submissions.
 */
export const getCommunitySubmissions = async () => {
    try {
        // Note: For a real app, you might only select specific, non-sensitive columns
        // e.g., .select('id, doc_type, latitude, longitude')
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .not('latitude', 'is', null); // Only get submissions that have a location

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error fetching community submissions:', error);
        throw new Error('Could not fetch community data.');
    }
};

/**
 * Fetches all submissions with a 'pending' status.
 * This will only work if the logged-in user has the 'admin' role,
 * as defined by our Supabase RLS policies.
 * @returns {Promise<Array>} A list of all pending submissions.
 */
export const getPendingSubmissionsForAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*') // Get all columns
      .eq('status', 'pending') // Filter by status
      .order('created_at', { ascending: true }); // Show the oldest first

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching pending submissions for admin:', error);
    throw new Error('Could not fetch pending submissions.');
  }
};

/**
 * Fetches ALL submissions for an admin.
 * This is used for the dashboard total count, which should not decrease.
 * This will only work if the logged-in user has the 'admin' role,
 * as defined by our Supabase RLS policies.
 * @returns {Promise<Array>} A list of all submissions.
 */
export const getAllSubmissionsForAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*'); // Get all columns

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching all submissions for admin:', error);
    throw new Error('Could not fetch all submissions.');
  }
};

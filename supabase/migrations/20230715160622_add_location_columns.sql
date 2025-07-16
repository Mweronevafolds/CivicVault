-- Add location columns to submissions table
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(9,6),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(9,6),
ADD COLUMN IF NOT EXISTS registration_location TEXT;

-- Add location columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(9,6),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(9,6),
ADD COLUMN IF NOT EXISTS last_location TEXT;

-- Update policies to include location columns
CREATE POLICY "Users can view their own submissions with location"
ON public.submissions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions with location"
ON public.submissions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

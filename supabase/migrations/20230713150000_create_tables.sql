-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  place_of_birth TEXT,
  parent_names TEXT,
  id_number TEXT,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for submissions
CREATE POLICY "Users can view their own submissions" 
ON public.submissions 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions"
ON public.submissions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('registrations', 'registrations', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Allow public read access to registration documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'registrations');

CREATE POLICY "Allow authenticated users to upload to registrations"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'registrations' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'registrations' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'registrations' AND (storage.foldername(name))[1] = auth.uid()::text);

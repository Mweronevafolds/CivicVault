# Supabase Setup Guide

This guide will help you set up the Supabase backend for the CivicVault application.

## Prerequisites

1. A Supabase account (https://supabase.com/)
2. A new or existing Supabase project

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query and run the SQL from `supabase/migrations/20230713150000_create_tables.sql`

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Storage Configuration

1. Go to the Storage section in your Supabase dashboard
2. The SQL migration should have created a 'registrations' bucket
3. Verify that the bucket has the following CORS configuration:
   - Allowed origins: `*` (or your app's domain in production)
   - Allowed methods: GET, POST, PUT, DELETE
   - Allowed headers: *
   - Max age: 3600

## Authentication Providers

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable "Email" provider
3. Configure your site URL and redirect URLs in Authentication > URL Configuration
   - Site URL: Your app's URL (e.g., http://localhost:19006)
   - Redirect URLs: Add your app's redirect URLs (e.g., http://localhost:19006/auth/callback)

## Email Templates (Optional)

Customize the email templates in Authentication > Templates if needed.

## Testing

1. Try signing up a new user
2. Verify that you receive a confirmation email
3. Log in with the new user
4. Test document submission and file uploads

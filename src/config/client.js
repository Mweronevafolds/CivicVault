import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Configuration ---
const supabaseUrl = 'https://scagqdfncrxxuftinwac.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjYWdxZGZuY3J4eHVmdGlud2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDE3OTgsImV4cCI6MjA2NzkxNzc5OH0.PNf8u6pPJAq1IVaQDmYQFO2MXC3YGUHR_nLBt9HuW54';

// Initialize the Supabase client. This one client will handle
// authentication, database, and storage for our entire app.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

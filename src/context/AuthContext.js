import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/client';

// 1. Create the context
const AuthContext = createContext();

/**
 * This Provider component manages the user's authentication state,
 * including their session and their profile data (like their role).
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session when the app starts
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        // If there's a user, fetch their profile from the 'profiles' table
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
            console.error("Error fetching profile:", error);
        }
        setProfile(profileData);
      }
      setLoading(false);
    };

    fetchSession();

    // Listen for changes in authentication state (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            setProfile(profileData);
        } else {
            setProfile(null);
        }
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile, // This will contain the 'role'
    loading,
    isAdmin: profile?.role === 'admin', // A handy boolean for checking admin status
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy access to the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

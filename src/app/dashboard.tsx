import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import ModernAppBar from '../components/ModernAppBar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DashboardScreen from '../screens/DashboardScreen';

export default function Dashboard() {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    // If auth is done loading and the user is not an admin, redirect them.
    if (!loading && !isAdmin) {
      router.replace('/home');
    }
  }, [isAdmin, loading, router]);

  // While checking auth, show a loading spinner.
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If the user is an admin, show the dashboard.
  // Otherwise, this will be null while the redirect happens.
  return isAdmin ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ModernAppBar 
        title="Admin Dashboard"
        onBack={() => router.back()}
      />
      <DashboardScreen isAdmin={isAdmin} />
    </SafeAreaView>
  ) : null;
}

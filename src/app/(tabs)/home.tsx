import React, { useState, useEffect } from 'react';
import {
  View, Text, SafeAreaView, Platform,
  TouchableOpacity, FlatList, ActivityIndicator, RefreshControl
} from 'react-native';
import { HomeScreenStyles } from '../../constants/Styles';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getPendingSubmissionsForAdmin } from '../../api/ApiService';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

type Submission = {
  id: string;
  doc_type: string;
  full_name: string;
  created_at: string;
};

type Profile = {
  username?: string;
};

const AdminDashboard = () => {
    const [applications, setApplications] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme() ?? 'light';

    const fetchData = async () => {
        setLoading(true);
        try {
            const pendingApps = await getPendingSubmissionsForAdmin();
            setApplications(pendingApps || []);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('Unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderApplicationItem = ({ item }: {item: Submission}) => (
        <TouchableOpacity style={[HomeScreenStyles.adminItem, { 
          backgroundColor: Colors[colorScheme].card 
        }]}>
            <Ionicons 
                name={item.doc_type === 'Birth Certificate' ? 'person-add-outline' : 'id-card-outline'} 
                size={24} 
                color={Colors[colorScheme].primary} 
            />
            <View style={HomeScreenStyles.adminItemDetails}>
                <Text style={[HomeScreenStyles.adminItemName, { 
                  color: Colors[colorScheme].text 
                }]}>
                  {item.full_name}
                </Text>
                <Text style={[HomeScreenStyles.adminItemType, { 
                  color: Colors[colorScheme].icon 
                }]}>
                  {item.doc_type}
                </Text>
            </View>
            <Text style={[HomeScreenStyles.adminItemDate, { 
              color: Colors[colorScheme].icon 
            }]}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
            <Ionicons name="chevron-forward" size={24} color={Colors[colorScheme].icon} />
        </TouchableOpacity>
    );

    return (
        <View style={[HomeScreenStyles.adminContainer, { 
          backgroundColor: Colors[colorScheme].background 
        }]}>
            <Text style={[HomeScreenStyles.adminTitle, { 
              color: Colors[colorScheme].text 
            }]}>
              Pending Applications ({applications.length})
            </Text>
            {loading ? (
                <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
            ) : (
                <FlatList
                    data={applications}
                    renderItem={renderApplicationItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={
                      <Text style={[HomeScreenStyles.emptyText, { 
                        color: Colors[colorScheme].icon 
                      }]}>
                        No pending applications.
                      </Text>
                    }
                    refreshControl={
                      <RefreshControl 
                        refreshing={loading} 
                        onRefresh={fetchData} 
                        colors={[Colors[colorScheme].primary]}
                      />
                    }
                />
            )}
        </View>
    );
};

const MobileDashboard = ({ profile }: {profile: Profile}) => {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';

    const renderDashboardCard = (
      title: string, 
      iconName: 'person-add-outline' | 'id-card-outline',
      route: '/camera',
      params: { type: 'birth' | 'id' }
    ) => (
        <TouchableOpacity 
            style={[HomeScreenStyles.card, { 
              backgroundColor: Colors[colorScheme].card 
            }]} 
            onPress={() => router.push({ pathname: route, params })}
        >
          <Ionicons name={iconName} size={40} color={Colors[colorScheme].primary} />
          <Text style={[HomeScreenStyles.cardText, { 
            color: Colors[colorScheme].text 
          }]}>
            {title}
          </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[HomeScreenStyles.mobileContainer, { 
          backgroundColor: Colors[colorScheme].background 
        }]}>
            <Text style={[HomeScreenStyles.greeting, { 
              color: Colors[colorScheme].text 
            }]}>
              Hello, {profile?.username || 'User'}
            </Text>
            <View style={HomeScreenStyles.cardContainer}>
                {renderDashboardCard('Register Birth', 'person-add-outline', '/camera', { type: 'birth' })}
                {renderDashboardCard('Request ID', 'id-card-outline', '/camera', { type: 'id' })}
            </View>
        </View>
    );
};

export default function HomeScreen() {
  const { profile, isAdmin } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';

  if (isAdmin && Platform.OS === 'web') {
    return (
        <SafeAreaView style={{ 
          flex: 1, 
          backgroundColor: Colors[colorScheme].background 
        }}>
            <Stack.Screen options={{ 
              title: 'Admin Panel', 
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors[colorScheme].background,
              },
              headerTintColor: Colors[colorScheme].tint
            }} />
            <AdminDashboard />
        </SafeAreaView>
    );
  }

  if (Platform.OS !== 'web') {
    return (
        <SafeAreaView style={{ 
          flex: 1, 
          backgroundColor: Colors[colorScheme].background 
        }}>
            <Stack.Screen options={{ title: 'Home', headerShown: false }} />
            <MobileDashboard profile={profile} />
        </SafeAreaView>
    );
  }
  
  return (
        <SafeAreaView style={[HomeScreenStyles.accessDeniedContainer, { 
          backgroundColor: Colors[colorScheme].background 
        }]}>
        <Stack.Screen options={{ title: 'Access Denied', headerShown: false }} />
        <Ionicons name="shield-outline" size={60} color={Colors[colorScheme].primary} />
        <Text style={[HomeScreenStyles.accessDeniedTitle, { 
          color: Colors[colorScheme].text 
        }]}>
          Web Access Restricted
        </Text>
        <Text style={[HomeScreenStyles.accessDeniedText, { 
          color: Colors[colorScheme].text 
        }]}>
          The CivicVault web portal is for administrative use only. Please use the mobile application to manage your submissions.
        </Text>
    </SafeAreaView>
  );
};

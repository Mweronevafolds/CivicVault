import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { OfflineContext } from '../context/OfflineContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ViewApplicationsScreen = ({ navigation }) => {
  const { offlineQueue, submittedDocs } = useContext(OfflineContext);
  const { colors, isDark } = useTheme();
  
  const pendingSubmissions = offlineQueue.map(item => ({
    id: item.timestamp.toString(),
    type: item.docType === 'birth' ? 'Birth Certificate' : 'ID Card',
    name: item.formData.fullName,
    status: 'Pending Sync'
  }));

  const syncedSubmissions = submittedDocs.map(item => ({
    id: item.timestamp.toString(),
    type: item.docType === 'birth' ? 'Birth Certificate' : 'ID Card', 
    name: item.formData.fullName,
    status: 'Submitted'
  }));

  const renderItem = ({ item }) => (
    <View style={[
      styles.itemContainer,
      { backgroundColor: colors.card }
    ]}>
      <View style={[
        styles.itemIcon,
        { backgroundColor: colors.primary + '20' }
      ]}>
        <Ionicons
          name={item.type === 'Birth Certificate' ? 'person-add-outline' : 'id-card-outline'}
          size={24}
          color={colors.primary}
        />
      </View>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemType, { color: colors.text }]}>{item.type}</Text>
        <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
      </View>
      <View style={styles.itemStatus}>
        <Text style={[
          styles.statusText,
          { color: item.status === 'Submitted' ? colors.success : colors.notification }
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[
        styles.header,
        { 
          borderBottomColor: colors.border,
          backgroundColor: colors.card
        }
      ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Applications</Text>
      </View>

      <FlatList
        data={[...pendingSubmissions, ...syncedSubmissions]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={[styles.listHeader, { color: colors.text }]}>
            Showing all submissions. Items saved offline will be synced automatically.
          </Text>
        }
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {/* TODO: Add refresh logic */}}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No applications found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  listContainer: {
    padding: 20,
  },
  listHeader: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  itemIcon: {
    marginRight: 15,
    padding: 10,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 14,
  },
  itemStatus: {
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ViewApplicationsScreen;

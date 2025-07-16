import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { createSubmission } from '../api/ApiService'; // We'll need this for processing the queue

export interface OfflineItem {
  timestamp: number;
  docType: 'birth' | 'id'; // Add docType to know what kind of form it is
  formData: {
    fullName: string;
    [key: string]: any;
  };
  imageUri: string; // Add imageUri to handle image uploads
}

interface OfflineContextType {
  isOnline: boolean;
  queue: OfflineItem[];
  addToQueue: (item: OfflineItem) => void;
}

export const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [queue, setQueue] = useState<OfflineItem[]>([]);

  // Load queue from storage on app start
  useEffect(() => {
    const loadQueue = async () => {
      try {
        const savedQueue = await AsyncStorage.getItem('@offline_queue');
        if (savedQueue) setQueue(JSON.parse(savedQueue));
      } catch (error) {
        console.error('Failed to load offline queue:', error);
      }
    };
    loadQueue();
  }, []);

  // Process queue when online status changes to true
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const onlineStatus = !!state.isConnected && !!state.isInternetReachable;
      setIsOnline(onlineStatus);
      if (onlineStatus && queue.length > 0) {
        processQueue();
      }
    });

    return () => unsubscribe();
  }, [queue, isOnline]); // Rerun when queue or online status changes

  // Save queue to storage whenever it changes
  useEffect(() => {
    const saveQueue = async () => {
      try {
        await AsyncStorage.setItem('@offline_queue', JSON.stringify(queue));
      } catch (error) {
        console.error('Failed to save offline queue:', error);
      }
    };
    saveQueue();
  }, [queue]);

  const addToQueue = (item: OfflineItem) => {
    setQueue(prev => [...prev, item]);
    Alert.alert("You're Offline", "Your submission has been saved and will be uploaded automatically when you're back online.");
  };

  const processQueue = async () => {
    if (queue.length === 0 || !isOnline) {
      return;
    }

    console.log('Processing offline queue...');
    let successCount = 0;
    const remainingItems = [...queue];

    for (const item of queue) {
      try {
        // Here you would call your actual submission logic
        console.log('Submitting item for:', item.formData.fullName);
        await createSubmission({
          ...item.formData,
          doc_type: item.docType,
          image_uri: item.imageUri
        });
        
        // On success, remove item from the temporary queue
        const index = remainingItems.findIndex(q => q.timestamp === item.timestamp);
        if (index > -1) {
          remainingItems.splice(index, 1);
          successCount++;
        }
      } catch (error) {
        console.error('Failed to submit item from queue:', error);
        // Item remains in the queue for the next attempt
      }
    }
    
    setQueue(remainingItems);

    if (successCount > 0) {
      Alert.alert("Sync Complete", `${successCount} offline submission(s) have been synced successfully.`);
    }
  };

  return (
    <OfflineContext.Provider value={{ isOnline, queue, addToQueue }}>
      {children}
    </OfflineContext.Provider>
  );
};

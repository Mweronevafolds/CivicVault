import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

interface OfflineItem {
  timestamp: number;
  formData: {
    fullName: string;
    [key: string]: any;
  };
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

  // Sync queue when online status changes to true
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        const onlineStatus = (state.isConnected && state.isInternetReachable) ?? false;
        setIsOnline(onlineStatus);
        if (onlineStatus) {
          processQueue();
        }
      });

      return () => unsubscribe();
    }, [queue]); // Rerun effect if queue changes while online

  // Save queue to storage whenever it changes
  useEffect(() => {
    const saveQueue = async () => {
      try {
        await AsyncStorage.setItem('@offline_queue', JSON.stringify(queue));
      } catch (error) {
        console.error('Failed to save offline queue:', error);
      }
    }
    saveQueue();
  }, [queue]);

  const addToQueue = (item: OfflineItem) => {
    setQueue(prev => [...prev, item]);
  };

  const processQueue = async () => {
    if (queue.length === 0) {
      return;
    }
    
    console.log('Processing offline queue...');
    let successCount = 0;
    
    // Create a mutable copy of the queue to work with
    const newQueue = [...queue];

    for (const item of queue) {
      try {
        // Mock API call
        console.log('Submitting item:', item.formData.fullName);
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        // On success, find and remove item from the temporary queue
        const index = newQueue.findIndex(q => q.timestamp === item.timestamp);
        if (index > -1) {
            newQueue.splice(index, 1);
            successCount++;
        }
      } catch (error) {
        console.error('Failed to submit item from queue:', error);
        // Item remains in the queue for the next attempt
      }
    }
    
    setQueue(newQueue);
    if(successCount > 0) {
        Alert.alert("Sync Complete", `${successCount} offline submission(s) have been synced successfully.`);
    }
  };

  return (
    <OfflineContext.Provider value={{ isOnline, queue, addToQueue }}>
      {children}
    </OfflineContext.Provider>
  );
};

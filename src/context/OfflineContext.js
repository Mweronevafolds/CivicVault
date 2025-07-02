import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [queue, setQueue] = useState([]);

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

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@offline_queue', JSON.stringify(queue)).catch(error => {
      console.error('Failed to save offline queue:', error);
    });
  }, [queue]);

  const addToQueue = (item) => {
    setQueue(prev => [...prev, item]);
  };

  const removeFromQueue = (item) => {
    setQueue(prev => prev.filter(i => i !== item));
  };

  return (
    <OfflineContext.Provider value={{ isOnline, queue, addToQueue, removeFromQueue }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  return useContext(OfflineContext);
};

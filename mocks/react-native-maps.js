// Mock for react-native-maps on web
const React = require('react');
const { View } = require('react-native');

// Simple mock components
const MockMapView = (props) => {
  return React.createElement('div', { 
    style: { 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666',
      fontSize: '1.2em'
    } 
  }, 'Map Placeholder (Web)');
};

const MockMarker = (props) => {
  return React.createElement('div', { 
    style: { 
      width: 20, 
      height: 20, 
      backgroundColor: 'red', 
      borderRadius: 10,
      border: '2px solid white',
      boxShadow: '0 0 5px rgba(0,0,0,0.3)'
    } 
  });
};

// Export mock components
module.exports = {
  __esModule: true,
  default: MockMapView,
  Marker: MockMarker,
  PROVIDER_GOOGLE: 'google',
  PROVIDER_DEFAULT: 'default',
  // Add other required exports with no-op functions
  enableLatestRenderer: () => {},
  setApiKey: () => {},
  setAccessToken: () => {},
  setRegion: () => {},
  animateToRegion: () => {},
  fitToCoordinates: () => {},
  getCamera: () => ({}),
  getMapBoundaries: () => ({
    northEast: { latitude: 0, longitude: 0 },
    southWest: { latitude: 0, longitude: 0 }
  })
};

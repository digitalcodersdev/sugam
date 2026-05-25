import React, { useEffect } from 'react';
import {StatusBar, Text, View,PermissionsAndroid, Platform} from 'react-native';
import {Provider as StoreProvider} from 'react-redux';
import RootRoutes from './navigator/RootRoutes';
import store from './store/app.store';
import {ThemeContextProvider} from './store/contexts/ThemeContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import R from './resources/R';
import 'react-native-gesture-handler';
navigator.geolocation = require('@react-native-community/geolocation');
import { Buffer } from 'buffer';
// import useLocationTracking from './library/customHooks/useLocationTracking';
global.Buffer = Buffer;


const App = () => {
  // useLocationTracking(); 
  // const requestPermissions = async () => {
  //   if (Platform.OS === "android") {
  //     await PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  //     ]);
  //   }
  // };
  
  // useEffect(() => {
  //   requestPermissions();

  // }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StoreProvider store={store}>
        <ThemeContextProvider value={{color: 'white'}}>
          <StatusBar
            backgroundColor={R.colors.SLATE_GRAY}
            barStyle="light-content"
          />
          <RootRoutes />
        </ThemeContextProvider>
      </StoreProvider>
    </GestureHandlerRootView>
  );
};

export default App;

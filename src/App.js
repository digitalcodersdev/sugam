import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import {Provider as StoreProvider} from 'react-redux';
import RootRoutes from './navigator/RootRoutes';
import store from './store/app.store';
import {ThemeContextProvider} from './store/contexts/ThemeContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import R from './resources/R';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StoreProvider store={store}>
        <ThemeContextProvider value={{color: 'white'}}>
          <StatusBar backgroundColor={R.colors.primary} barStyle="light-content" />
          <RootRoutes />
        </ThemeContextProvider>
      </StoreProvider>
    </GestureHandlerRootView>
  );
};

export default App;

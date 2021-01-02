/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import * as Font from 'expo-font';
import {View} from 'react-native';
import Router from './screens/Router';
import GeneralStatusBar from './components/GeneralStatusBar';
import colors from './layouts/colors';
import {StoreProvider} from './context';
import IsLoading from './components/IsLoading';

const App = () => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    (async function () {
      await Font.loadAsync({
        Roboto_medium: require('./assets/fonts/Roboto-Medium.ttf'),
      });
      setIsReady(true);
    })();
    SplashScreen.hide();
  }, []);

  return (
    <StoreProvider>
      <View style={{flex: 1}}>
        <GeneralStatusBar backgroundColor={colors.primary} />
        <View style={{flex: 1}}>{isReady ? <Router /> : <IsLoading />}</View>
      </View>
    </StoreProvider>
  );
};

export default App;

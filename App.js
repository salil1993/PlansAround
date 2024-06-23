//import liraries
import React, { Component, useEffect } from 'react';
import 'react-native-gesture-handler';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Routes from './src/Navigation/Routes';
import { Provider } from 'react-redux';
import { myStore } from './src/redux/store';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'
import { MenuProvider } from 'react-native-popup-menu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging'
import { DisplayNotification } from './src/utils/helperFunctions';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
// create a component
const App = () => {
  let persistor = persistStore(myStore)
  useEffect(() => {
    GetFCM();
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '139290010094-hiubrhda8oohsm859cibk7on6o4ai1mv.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, [])
  const GetFCM = async () => {
    messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('fcm token', token,)
    await AsyncStorage.setItem('fcmToken', token);
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived in foreground!', JSON.stringify(remoteMessage));
      console.log("remoteMessage", remoteMessage,)
      DisplayNotification(remoteMessage);
    });

    return (() => {

    });
  }, []);







  return (
    <>
      <Provider store={myStore}>
        <PersistGate persistor={persistor}>
          <MenuProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Routes />
            </GestureHandlerRootView>
          </MenuProvider>
        </PersistGate>
      </Provider>
    </>
  );
};



//make this component available to the app
export default App;

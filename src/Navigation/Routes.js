import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import { useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { Linking } from 'react-native';


const Stack = createNativeStackNavigator();
const NAVIGATION_IDS = ['login','signup'];

function buildDeepLinkFromNotificationData(data) {
    const navigationId = data?.navigationId;
    if (!NAVIGATION_IDS.includes(navigationId)) {
      console.warn('Unverified navigationId', navigationId)
      return null;
    }
    if (navigationId === 'signup') {
      return 'myapp://home';
    }
    
    const postId = data?.postId;
    if (typeof postId === 'login') {
      return `myapp://login/${postId}`
    }
    console.warn('Missing postId')
    return null
  }

  
const linking = {
    prefixes: ["myapp://"],
    config: {
        screens:{
            liveevents:'liveevents'
        }
      /* configuration for matching screens with paths */
    },
    async getInitialURL() {
        const url = await Linking.getInitialURL();
        if (typeof url === 'string') {
          return url;
        }
        //getInitialNotification: When the application is opened from a quit state.
        const message = await messaging().getInitialNotification();
        const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
        if (typeof deeplinkURL === 'string') {
          return deeplinkURL;
        }
      },
      subscribe(listener) {
        const onReceiveURL = ({url}) => listener(url);
    
        // Listen to incoming links from deep linking
        const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
    
        //onNotificationOpenedApp: When the application is running, but in the background.
        const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
          const url = buildDeepLinkFromNotificationData(remoteMessage.data)
          if (typeof url === 'string') {
            listener(url)
          }
        });
    
        return () => {
          linkingSubscription.remove();
          unsubscribe();
        };
      },
  };

  
  


export default function Routes() {
    const userStatus = useSelector((state) => state.persistedReducer.authSlice);
    console.log(userStatus, 'yha to ye hai');

    return (
        <NavigationContainer linking={linking}  >
            <Stack.Navigator>
                {/* {AuthStack(Stack)} */}
                {userStatus?.isLogin ? MainStack(Stack) : AuthStack(Stack)}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging'
import { DisplayNotification } from './src/utils/helperFunctions';

LogBox.ignoreAllLogs()
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    DisplayNotification(remoteMessage);
    // Alert.alert('A new Notification arrived in background!', JSON.stringify(remoteMessage));
    console.log('hello backgroound message')
});

messaging().getInitialNotification(async remoteMessage => {
    console.log('Message handled in the kill state!', remoteMessage);
    DisplayNotification(remoteMessage);

    // Alert.alert('A new Notification arrived in background!', JSON.stringify(remoteMessage));
});
AppRegistry.registerComponent(appName, () => App);

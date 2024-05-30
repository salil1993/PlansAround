import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneNumber from 'libphonenumber-js';
import notifee, { AndroidColor } from '@notifee/react-native';


export const storeData = async (key, value) => {
  try {
    var jsonValue = value
    if (typeof (value) !== 'string') {
      jsonValue = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    return e
  }
};


export const getData = async (key) => {
  try {
    const res = await AsyncStorage.getItem(key);
    return res != null ? typeof (res) !== 'string' ? JSON.parse(res) : res : null;
  } catch (e) {
    return e
    // error reading value
  }
};

export const validatePhoneNumber = (phoneNumber, countryCode) => {
  console.log(phoneNumber, countryCode, 'function m')
  try {
    const number = PhoneNumber(phoneNumber, countryCode);
    if (number.isValid()) {
      return true; // Phone number is valid.
    } else {
      return false; // Phone number is not valid.
    }
  } catch (e) {
    // Handle parsing errors, such as an invalid phone number.
    return false;
  }
};



export const reverseGeocode = async (currentLocation) => {
  const { latitude, longitude } = currentLocation;
  const apiKey = 'AIzaSyDoIp9EAqQ10AGtqcgNm6TWndqvUgroHJk';
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data, 'addrress')

    if (data.results && data.results.length > 0) {
      const formattedAddress = data.results[0].formatted_address;
      return formattedAddress;
    }
  } catch (error) {
    console.error('Error fetching address:', error);
  }
};



export const DisplayNotification = async (data) => {
  // Request permissions (required for iOS)
  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({

    title: data.notification.title,
    body: data.notification.body,
    android: {
      channelId,
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}
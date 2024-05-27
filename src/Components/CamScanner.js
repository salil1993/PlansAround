//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { moderateScale } from '../styles/responsiveSize';
import HeaderBack from './HeaderBack';
import WrapperContainer from './WrapperContainer';
import { useNavigation } from '@react-navigation/native';
import navigationStrings from '../Navigation/navigationStrings';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import { getData } from '../utils/helperFunctions';
import Loader from './Loader';

// create a component
const CamScanner = ({ route }) => {
  const [LoadEvent, setLoadEvent] = useState(false)

  console.log(route, 'rute...')
  const EventId = route.params.data;
  const navigation = useNavigation();

  const handleQRCodeScan = async (scannedData) => {
    console.log(scannedData, 'scannedEvent')
    if (EventId && scannedData) {
      setLoadEvent(true)
      console.log(EventId, '.....', scannedData)
      let usertoken = await getData('UserToken');
      console.log(usertoken);
      const headers = {
        'Authorization': `Bearer ${usertoken}`,
        'Content-Type': "application/json",
      };
      axios.post('https://plansaround-backend.vercel.app/api/mobile/homepage/live-event/mark-attendance',
        {
          "eventId": EventId,
          "bookingId": scannedData
        }, { headers })
        .then((res) => {
          console.log(res, 'resAttend')
          setLoadEvent(false);
          Snackbar.show({
            text: `${res.data.message}`,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: '#005BD4',
            textColor: "#fff",
          })
          navigation.goBack();
        })
        .catch((err) => {
          setLoadEvent(false)
          console.log(err, 'errAttedn')
          Snackbar.show({
            text: `${err.response.data.message}`,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
            textColor: "#fff",
          })
          navigation.goBack();


        })
    } else {
      Snackbar.show({
        text: `${'Data Missing'}`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
        textColor: "#fff",
      });
    }


  };


  return (
    <WrapperContainer>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <HeaderBack style={{ paddingHorizontal: moderateScale(10), backgroundColor: '#fff', }} mainText='Back' />
      <View style={styles.container}>
        {LoadEvent ? <Loader /> : 
        <QRCodeScanner
         //  onRead={({ data }) => console.log(data, 'data')}
          // flashMode={RNCamera.Constants.FlashMode.torch}
          onRead={({ data }) => handleQRCodeScan(data)}
          reactivate={true}
          reactivateTimeout={800}
          showMarker={true}
        />}
      </View>
    </WrapperContainer>

  )
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
});

//make this component available to the app
export default CamScanner;

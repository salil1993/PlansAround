//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, Alert, PermissionsAndroid } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScaleVertical, moderateScale, textScale } from '../../styles/responsiveSize';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

// create a component
const ShowonMap = ({ route, navigation }) => {
    const EData = route.params.Elocation;
    const UData = route.params.Ulocation;
    const type = route.params.type;
    const [CurrentLocation, setCurrentLocation] = useState('');
    useEffect(() => {
        requestLocationPermission()
    }, [])

    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'ios') {
                // No need to request permission on iOS
                getCurrentLocation();
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    console.log('Location permission denied');
                }
            }
        } catch (error) {
            console.error('Error requesting location permission: ', error);
        }
    };

    const getCurrentLocation = () => {
        setLoading(true);
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                console.log('Current Location:', { latitude, longitude });
                setCurrentLocation({ latitude, longitude })
                // dispatch(userCurrentLocation(CurrentLocation))
                // setLoading(false);
                // setFirstLocation(true);
                // setTextshow(true)
            },
            error => {
                console.error('Error getting location: ', error);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };


    return (
        <WrapperContainer>
            <HeaderBack mainText='Event location' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
           { type == 'EventHosting'?<View style={styles.container}>

                {EData && UData ?
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: EData.latitude != null ?EData.latitude:37.78825,
                            longitude: EData.longitude != null ?EData.longitude:-122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,

                        }}
                        loadingEnabled={true}
                        loadingIndicatorColor='#005BD4'
                    // moveOnMarkerPress={true}
                    // showsUserLocation={true}
                    // showsMyLocationButton={true}
                    >
                        {/* <Circle
                            // key={event.id}
                            center={{
                                latitude: EData.latitude,
                                longitude: EData.longitude,
                            }}
                            radius={500} // Adjust radius as needed (in meters)
                            strokeWidth={2}
                            strokeColor="rgba(255,0,0,0.5)"
                            fillColor="rgba(255,0,0,0.2)"
                            zIndex={2}
                        /> */}
                        <Marker pinColor = {"purple"}  coordinate={UData} title="Your Location" />
                        <Marker coordinate={EData} title="Event Location" />
                        <MapViewDirections
                            origin={UData}
                            destination={EData}
                            apikey={'AIzaSyDoIp9EAqQ10AGtqcgNm6TWndqvUgroHJk'}
                            strokeWidth={3}
                            strokeColor="#005BD4"
                        />


                        {/* <Polyline
                            coordinates={[UData, EData]}
                            strokeWidth={4}
                            strokeColor="blue"
                        /> */}
                    </MapView>
                    :
                    <Text style={styles.eventtxt}>No Location exists</Text>
                }
            </View>: <View style={styles.container}>

{EData && UData ?
    <MapView
        style={styles.map}
        initialRegion={{
            latitude: EData.latitude?EData.latitude: CurrentLocation.latitude,
            longitude: EData.longitude?EData.longitude:CurrentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,

        }}
        loadingEnabled={true}
        loadingIndicatorColor='#005BD4'
    // moveOnMarkerPress={true}
    // showsUserLocation={true}
    // showsMyLocationButton={true}
    >
        <Circle
            // key={event.id}
            center={{
                latitude: EData.latitude,
                longitude: EData.longitude,
            }}
            radius={500} // Adjust radius as needed (in meters)
            strokeWidth={2}
            strokeColor="rgba(255,0,0,0.5)"
            fillColor="rgba(255,0,0,0.2)"
            zIndex={2}
        />
        {/* <Marker pinColor = {"purple"}  coordinate={UData} title="Your Location" />
        <Marker coordinate={EData} title="Event Location" />
        <MapViewDirections
            origin={UData}
            destination={EData}
            apikey={'AIzaSyDoIp9EAqQ10AGtqcgNm6TWndqvUgroHJk'}
            strokeWidth={3}
            strokeColor="#005BD4"
        /> */}


        {/* <Polyline
            coordinates={[UData, EData]}
            strokeWidth={4}
            strokeColor="blue"
        /> */}
    </MapView>
    :
    <Text style={styles.eventtxt}>No Location exists</Text>
}
</View>}

        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#2c3e50',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    eventtxt: {
        color: '#4F4F4F',
        fontSize: textScale(20),
        fontWeight: '500'
    },
});

//make this component available to the app
export default ShowonMap;

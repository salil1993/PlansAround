//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context';
import imagePath from '../../constants/imagePath';
import { height, moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { userCurrentLocation } from '../../redux/Slices/UserSlice';
import SearchPlaces from '../../Components/SearchPlaces';
import { useIsFocused } from '@react-navigation/native';
import { LocationTwo } from '../../API/Api';
import Snackbar from 'react-native-snackbar';
import navigationStrings from '../../Navigation/navigationStrings';
// create a component
const SetLocation = ({ navigation }) => {
    const [Loading, setLoading] = useState(false);
    const IsFocused = useIsFocused();
    const dispatch = useDispatch();
    useEffect(() => {
        requestLocationPermission();
    }, []);

    const [Textshow, setTextshow] = useState(false)
    const [FirstLocation, setFirstLocation] = useState(false)

    const [CurrentLocation, setCurrentLocation] = useState('');
    const [ShowMap, setShowMap] = useState(false)

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
                dispatch(userCurrentLocation(CurrentLocation))
                setLoading(false);
                setFirstLocation(true);
                setTextshow(true)
            },
            error => {
                console.error('Error getting location: ', error);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };

    const onSearchhandle = (data, details) => {
        console.log(details.geometry.location, 'NewLocationyha')
        const selectedLocation = details.geometry.location;
        const { lat, lng } = selectedLocation;
        console.log(lat, '...', lng)
        const latitude = lat;
        const longitude = lng;
        setCurrentLocation({ latitude, longitude })
        setFirstLocation(false);
        setShowMap(true)
        setTextshow(true)
        // setFirstLocation(true);
        console.log(CurrentLocation, 'selected location')
    }


    const handleSumbit = () => {
        setLoading(true)
        const { latitude, longitude } = CurrentLocation;
        console.log(latitude, '....', longitude);
        LocationTwo(latitude, longitude).then((res) => {
            console.log(res, 'reslocation')
            const data = res.user.location;
            dispatch(userCurrentLocation(data))
            setLoading(false);
            Snackbar.show({
                text: `${res.message}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#005BD4',
                textColor: "#fff",
            });
            navigation.navigate(navigationStrings.SELECT_GENDER)

        }).catch((err) => {
            setLoading(false);
            console.log(err, 'errlocatioon')
            Snackbar.show({
                text: `${err.message}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        })
    }

    const handleSumbitSelcted = () => {
        console.log(CurrentLocation, 'mapksath')
        setLoading(true)
        const { latitude, longitude } = CurrentLocation;
        console.log(latitude, '....', longitude);
        LocationTwo(latitude, longitude).then((res) => {
            console.log(res, 'reslocation')
            const data = res.user.location;
            dispatch(userCurrentLocation(data))
            setLoading(false);
            Snackbar.show({
                text: `${res.message}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#005BD4',
                textColor: "#fff",
            });
            navigation.navigate(navigationStrings.SELECT_GENDER)
        }).catch((err) => {
            setLoading(false);
            console.log(err, 'errlocatioon')
            Snackbar.show({
                text: `${err.message}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        })
    }
    return (
        <WrapperContainer>
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                        <View style={[styles.helpIcon, { justifyContent: 'space-between' }]}>
                            <TouchableOpacity
                                style={{ marginRight: moderateScale(10) }}
                                onPress={() => navigation.goBack()}>
                                <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                            </TouchableOpacity>
                            <Image source={imagePath.help_outline} />
                        </View>
                        <View style={{ flex: 0.9, justifyContent: 'flex-start' }}>
                            <Image source={imagePath.location} style={{ alignSelf: 'center', height: scale(100), width: scale(100) }} />
                            <Text style={styles.phoneHeading}>Set a location</Text>
                            <Text style={[styles.phoneHeading2, { marginVertical: moderateScaleVertical(15) }]}>Lorem ipsum dolor sit amet, consect etur adi piscing elit, sed do eiusmod tempor incididunt.</Text>
                            <View>
                                <SearchPlaces onSearchPlaces={onSearchhandle} placeholder='Select a location' />
                            </View>
                        
                            {CurrentLocation && FirstLocation ? <View style={{ height: moderateScaleVertical(300), borderRadius: moderateScale(20) }}>
                                <MapView
                                    style={{
                                        flex: 1,
                                        marginVertical: moderateScale(20),
                                    }}

                                    loadingEnabled={true}
                                    loadingIndicatorColor='#005BD4'
                                    moveOnMarkerPress={true}
                                    showsUserLocation={true}
                                    showsMyLocationButton={true}
                                    initialRegion={{
                                        latitude: CurrentLocation.latitude,
                                        longitude: CurrentLocation.longitude,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}>
                                    <Marker
                                        tappable={true}
                                        pinColor='red'
                                        coordinate={{
                                            latitude: CurrentLocation.latitude,
                                            longitude: CurrentLocation.longitude,
                                        }}
                                        title="Your are Here!"
                                    />
                                </MapView>

                            </View>
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    {Textshow ? <Text style={styles.phoneHeading2}>Current Position Updated.</Text> :
                                        <Text style={styles.phoneHeading2}>Getting your current location. Please wait....</Text>}</View>}
                            <View>
                                {ShowMap &&
                                    <View style={{ height: moderateScaleVertical(300), borderRadius: moderateScale(20) }}>
                                        <MapView
                                            style={{
                                                flex: 1,
                                                marginVertical: moderateScale(20),
                                            }}

                                            loadingEnabled={true}
                                            loadingIndicatorColor='#005BD4'
                                            moveOnMarkerPress={true}
                                            showsUserLocation={true}
                                            showsMyLocationButton={true}
                                            initialRegion={{
                                                latitude: CurrentLocation.latitude,
                                                longitude: CurrentLocation.longitude,
                                                latitudeDelta: 0.0922,
                                                longitudeDelta: 0.0421,
                                            }}>
                                            <Marker
                                                tappable={true}
                                                pinColor='red'
                                                coordinate={{
                                                    latitude: CurrentLocation.latitude,
                                                    longitude: CurrentLocation.longitude,
                                                }}
                                                title="Your are Here!"
                                            />
                                        </MapView>

                                    </View>
                                }
                            </View>
                            {ShowMap ? <ButtonComp isLoading={Loading} onPress={handleSumbitSelcted} text='Use Selected Position' style={{ backgroundColor: '#005BD4', marginTop: moderateScaleVertical(10) }} />
                                :
                                <ButtonComp isLoading={Loading} onPress={handleSumbit} text='Use my current position' style={{ backgroundColor: '#005BD4', marginTop: moderateScaleVertical(10) }} />
                            }
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(12)
    },
    helpIcon: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    phoneHeading: {
        fontSize: scale(24),
        fontFamily: 'Roboto',
        fontWeight: '800',
        color: '#333'
    },
    phoneHeading2: {
        fontSize: scale(14),
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: '#4F4F4F'
    },
    contactText: {
        color: '#4F4F4F',
        fontSize: scale(14),
        fontFamily: 'Roboto',
        fontWeight: '400',
    },
    contactText2: {
        color: '#333',
        fontSize: scale(14),
        fontFamily: 'Roboto',
        fontWeight: '700',
        textDecorationLine: 'underline',
        marginLeft: moderateScale(5)
    },
    textInputContainer: {
        // height:scale(42),
        // width:scale(18),
        borderBottomColor: 'red'
    },
    roundedTextInput: {
        backgroundColor: 'white',
        borderRadius: moderateScale(5),
        height: moderateScale(52)

    },
    slidercontainer: {
        backgroundColor: '#fff',
        // height: scale(80),
        padding: moderateScale(10),
        elevation: 2,
        borderRadius: scale(5)
    },
    rangetxt: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(14),
        fontWeight: '700',
    },
    rangeval: {
        color: '#000',
        fontWeight: '700',
        fontSize: scale(14),
        fontFamily: 'Roboto'
    },


});

//make this component available to the app
export default SetLocation;

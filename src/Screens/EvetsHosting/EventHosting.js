//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale, moderateScaleVertical, scale, textScale, height, width } from '../../styles/responsiveSize';
import Loader from '../../Components/Loader';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import { useSelector } from 'react-redux';
import EventhostingComponent from './EventhostingComponent';
import { useFocusEffect } from '@react-navigation/native';

// import { Camera,useCameraDevices } from 'react-native-vision-camera';




// create a component
const EventHosting = ({ navigation }) => {
    const CurrentUserLocation = useSelector((state) => state.persistedReducer.authSlice.userCurrentLocation);
    const [eventData, setEventData] = useState([])
    const [LoadEvent, setLoadEvent] = useState(false)


    useEffect(() => {
        getCurrentEvents();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            // Your refresh logic goes here
            console.log('Screen is focused');
            getCurrentEvents();

            // Trigger a re-render of the component
            // For example, by updating state or fetching data again
        }, [])
    );
    const getCurrentEvents = async () => {
        setLoadEvent(true)
        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': 'multipart/form-data',
        };
        axios.get('https://plansaround-backend.vercel.app/api/mobile/my-event/hosting-event', { headers })
            .then((res) => {
                console.log(res, 'total Events')
                setEventData(res.data.events)
                setLoadEvent(false)
            }).
            catch((err) => {
                console.log(err)
                setLoadEvent(false)
            })
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;  // Convert degrees to radians
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    }




    return (
        <>
            <WrapperContainer>
                <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
                <HeaderBack mainText='Event’s Hosting' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
                <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                        {
                            LoadEvent ? <Loader /> :
                                <FlatList
                                    ListEmptyComponent={<View style={{ flex: 1, height: height, width: width, justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontSize: scale(15), color: '#4F4F4F', fontWeight: '700' }}>There is no events.</Text></View>}
                                    data={eventData}
                                    renderItem={({ item, index }) => {
                                        console.log(item, 'ye aaya...')
                                        const UserLocation = CurrentUserLocation;
                                        const Eventlocation = item.location;
                                        const Distance = calculateDistance(UserLocation.latitude, UserLocation.longitude, Eventlocation.latitude, Eventlocation.longitude)
                                        const date = item.dateOfEvent.split('T')
                                        return (
                                            <>
                                                <EventhostingComponent item={item}
                                                    index={index}
                                                    UserLocation={UserLocation}
                                                    Distance={Distance}
                                                    date={date}
                                                    Eventlocation={Eventlocation}
                                                />
                                            </>
                                        )
                                    }
                                    }
                                />
                        }
                    </View>
                </View>
            </WrapperContainer>
        </>

    );
};

// define your styles
const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    container2: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: moderateScale(5),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(12),
        elevation: 3,
        marginVertical: moderateScaleVertical(10),
        borderRadius: moderateScale(5),
    },
    eventtxt: {
        color: '#4F4F4F',
        fontSize: scale(14),
        fontWeight: '500'
    },
    charlie: {
        color: '#333',
        fontSize: scale(20),
        fontFamily: 'Roboto',
        fontWeight: '700',
        marginLeft: moderateScale(10)
    },




});

//make this component available to the app
export default EventHosting;

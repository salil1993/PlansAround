//import liraries
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, StatusBar,
    FlatList
} from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale, height, width, textScale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import HeaderBack from '../../Components/HeaderBack';
import Modal from 'react-native-modal'

import navigationStrings from '../../Navigation/navigationStrings';
import { useSelector } from 'react-redux';
import LiveEventsComponent from './LiveEventsComponent';
import axios from 'axios';
import { getData } from '../../utils/helperFunctions';
import Loader from '../../Components/Loader';





// create a component
const LiveEvents = ({ navigation }) => {
    const CurrentUserLocation = useSelector((state) => state.persistedReducer.authSlice.userCurrentLocation);
    const [LiveEventData, setLiveEventData] = useState([])
    const [LoadEvent, setLoadEvent] = useState(false)


    useEffect(() => {
        getCurrentEvents();
    }, [])
    const getCurrentEvents = async () => {
        setLoadEvent(true)
        let usertoken = await getData('UserToken');
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': 'multipart/form-data',
        };
        axios.get('https://plansaround-backend.vercel.app/api/mobile/homepage/live-event', { headers })
            .then((res) => {
                console.log(res, 'total Live Events')
                setLiveEventData(res.data.events)
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
                <HeaderBack mainText='Live Events' isLeftImage={false} style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(16) }} />
                <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                        {
                            LoadEvent ? <Loader /> :
                                <FlatList
                                    ListEmptyComponent={<View style={{ flex: 1, height: height, width: width, justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontSize: scale(15), color: '#4F4F4F', fontWeight: '700' }}>There is no live events.</Text></View>}
                                    // data={[112]}
                                    data={LiveEventData}
                                    renderItem={({ item, index }) => {
                                        console.log(item, 'ye aaya...')
                                        const UserLocation = CurrentUserLocation;
                                        const Eventlocation = item?.location;
                                        const Distance = calculateDistance(UserLocation?.latitude, UserLocation?.longitude, Eventlocation?.latitude, Eventlocation?.longitude)
                                        const date = item?.dateOfEvent?.split('T')
                                        return (
                                            <>
                                                <LiveEventsComponent item={item}
                                                    index={index}
                                                    // UserLocation={UserLocation}
                                                    Distance={Distance}
                                                    date={date}
                                                    // Eventlocation={Eventlocation}
                                                    onMarkComplete={async (id) => {
                                                        setLoadEvent(true)
                                                        let usertoken = await getData('UserToken');
                                                        const headers = {
                                                            'Authorization': `Bearer ${usertoken}`,
                                                        };
                                                        axios.post('https://plansaround-backend.vercel.app/api/mobile/my-event/mark-complete-event/' + id, { headers })
                                                            .then((res) => {
                                                                getCurrentEvents();
                                                            }).
                                                            catch((err) => {
                                                                console.log(err)
                                                                setLoadEvent(false)
                                                            })
                                                    }}
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



});

//make this component available to the app
export default LiveEvents;

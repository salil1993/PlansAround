//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { height, moderateScale, moderateScaleVertical, scale, textScale, width } from '../../styles/responsiveSize';
import Loader from '../../Components/Loader';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import imagePath from '../../constants/imagePath';

// create a component
const EventRejected = () => {
    const [LoadEvents, setLoadEvents] = useState(false);
    const [Event, setEvent] = useState('');
    useEffect(() => {
        getRequestedEvent();
    }, [])
    const getRequestedEvent = async () => {
        setLoadEvents(true)
        let usertoken = await getData('UserToken');

        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        axios.get(`https://plansaround-backend.vercel.app/api/mobile/my-event/event-requested?status=REJECTED`, { headers }, {
            "status": "ALL"
        })
            .then((res) => {
                console.log(res, 'eventDetail on home on Rejected requested screen')
                setEvent(res.data.eventRequest)
                setLoadEvents(false)
            }).
            catch((err) => {
                console.log(err)
                setLoadEvents(false)
            })
    }
    return (
        <WrapperContainer>
            <HeaderBack mainText='Rejected Event' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    {
                        LoadEvents ? <Loader /> :
                            <FlatList
                                ListEmptyComponent={<View style={{ flex: 1, height: height, width: width, justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontSize: scale(15), color: '#4F4F4F', fontWeight: '700' }}>There is no rejected events.</Text></View>}
                                data={Event}
                                renderItem={({ item, index }) => {
                                    console.log(item, 'ye aaya...')
                                    console.log(item.event, 'ye aaya...')

                                    // console.log(item, 'event')
                                    // const UserLocation = CurrentUserLocation;
                                    // const Eventlocation = item.location;
                                    // const Distance = calculateDistance(UserLocation.latitude, UserLocation.longitude, Eventlocation.latitude, Eventlocation.longitude)
                                    const date = item.event.dateOfEvent.split('T')
                                    return (
                                        <>
                                            <View style={styles.container2}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                                    {
                                                        item?.event?.user?.profilePicture ?
                                                            <Image source={{ uri: item?.event?.user?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                                            :
                                                            <Image source={imagePath.Gola} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                                    }
                                                    <Text style={styles.charlie}>{item?.event?.user?.fullName ? item?.event?.user?.fullName : 'NA'}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>

                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={styles.eventtxt}>Requested to Participate in event for <Text style={[styles.eventtxt, { color: '#333', fontWeight: '900' }]}>{item.event.name ? item.event.name : 'NA'}</Text>
                                                        </Text>
                                                        {/* {item.event.subCategory.icon ?
                                                            <Image source={{ uri: item.event.subCategory.icon }} style={{ height: moderateScale(20), width: moderateScale(20), borderRadius: moderateScale(10), marginLeft: moderateScale(8) }} resizeMode='contain' />
                                                            :
                                                            <Image source={imagePath.bTennis} />
                                                        } */}
                                                    </View>
                                                </View>
                                                <View style={{ marginBottom: moderateScaleVertical(5) }}>
                                                    <Text style={[styles.eventtxt, { fontWeight: '500' }]}>{item.event.description ? item.event.description.substring(0, 50) + '...' : 'NA'}</Text>
                                                </View>
                                                <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(2) }} />

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                                    <Text style={styles.eventtxt}>Event Type</Text>
                                                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.event.eventType ? item.event.eventType : 'NA'}</Text>
                                                </View>
                                                {
                                                    item.event.amount !== 0 && item.event.amount !== null &&
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                        <Text style={styles.eventtxt}>Amount</Text>
                                                        <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.event.amount ? item.event.amount : 'NA'} $</Text>
                                                    </View>
                                                }
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    <Text style={styles.eventtxt}>No. of People Required</Text>
                                                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}> Min: {item.event.minPeople ? item.event.minPeople : 'NA'}- Max: {item.event.maxPeople ? item.event.maxPeople : 'NA'}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    <Text style={styles.eventtxt}>No. of Participant Approved</Text>
                                                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.event.bookingsApproved}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    <Text style={styles.eventtxt}>Date & Time</Text>
                                                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{date ? date[0] : 'NA'}, {item.event.time.start ? item.event.time.start : 'NA'} - {item.event.time.end ? item.event.time.end : 'NA'}</Text>
                                                </View>
                                                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                                    <Text style={[styles.eventtxt, { fontWeight: '500', color: '#333' }]}>Images</Text>
                                                    <ScrollView
                                                        horizontal
                                                        showsHorizontalScrollIndicator={false}
                                                        style={{ marginVertical: moderateScaleVertical(5) }}
                                                    >
                                                        {item.event?.images ?
                                                            item.event?.images && item.event.images.map((item, index) => {
                                                                // console.log(item, 'images')
                                                                return (
                                                                    <View key={index} style={{ marginRight: moderateScale(5) }}>
                                                                        <Image source={{ uri: item }} style={{ borderRadius: scale(5), height: moderateScale(50), width: moderateScale(50), }} resizeMode='contain' />
                                                                    </View>
                                                                )
                                                            })
                                                            :
                                                            <>
                                                                <Image source={imagePath.pic1} style={{ borderRadius: scale(5), }} />
                                                                <Image source={imagePath.pic2} style={{ borderRadius: scale(5), marginLeft: moderateScale(5), }} />
                                                                <Image source={imagePath.pic3} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                                                                <Image source={imagePath.pic4} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                                                                <Image source={imagePath.pic1} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                                                                <Image source={imagePath.pic2} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                                                                <Image source={imagePath.pic3} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                                                                <Image source={imagePath.pic4} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                                                            </>
                                                        }
                                                    </ScrollView>
                                                    <View style={{ marginVertical: moderateScaleVertical(5), backgroundColor: '#FF7F7F', padding: moderateScale(10), borderRadius: moderateScale(5) }}>
                                                        <Text style={[styles.eventtxt, { fontWeight: '800', textTransform: 'capitalize', fontSize: textScale(18) }]}>Status</Text>
                                                        <Text style={[styles.eventtxt, { fontWeight: '500', textTransform: 'capitalize' }]}>{item.requestStatus ? item.requestStatus : 'NA'}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                        </>
                                    )
                                }
                                }
                            />
                    }
                </View>
            </View>

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
export default EventRejected;

//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale, height, width, textScale } from '../../styles/responsiveSize';
import HeaderBack from '../../Components/HeaderBack';
import axios from 'axios';
import { getData } from '../../utils/helperFunctions';
import Loader from '../../Components/Loader';
import { useSelector } from 'react-redux';



// create a component
const EventHosted = ({ navigation }) => {
    const [eventData, setEventData] = useState([])
    const [LoadEvent, setLoadEvent] = useState(false)
    const user = useSelector((state) => state.persistedReducer.authSlice.userData);

    useEffect(() => {
        getCurrentEvents();

    }, [])
    const getCurrentEvents = async () => {
        setLoadEvent(true)
        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': 'multipart/form-data',
        };
        axios.get('https://plansaround-backend.vercel.app/api/mobile/my-event/hosted-event', { headers })
            .then((res) => {
                console.log(res, 'Hosted Events')
                setEventData(res.data.events)
                setLoadEvent(false);
            }).
            catch((err) => {
                console.log(err)
                setLoadEvent(false);
            })
    }

    // const reverseGeocode = async (latitude, longitude) => {
    //     const apiKey = 'AIzaSyBWnqaUowVdjnPVHJAdLf0MMBgQRm6NMpc';
    //     const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    //     try {
    //         const response = await fetch(apiUrl);
    //         const data = await response.json();
    //         // console.log(data, 'addrress')

    //         if (data.results && data.results.length > 0) {
    //             const formattedAddress = data.results[0].formatted_address;
    //             return (formattedAddress);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching address:', error);
    //     }
    // };


    const handleSumbit = () => {
        // navigation.navigate(navigationStrings.WHERE_STUDY)
    }
    return (
        <WrapperContainer>
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <HeaderBack mainText='Event’s Hosted' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            {LoadEvent ? <Loader /> :
                <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={eventData}
                            ListEmptyComponent={<View style={{ flex: 1, height: height, width: width, justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontSize: scale(15), color: '#4F4F4F', fontWeight: '700' }}>There is no hosted events.</Text></View>}
                            renderItem={({ item, index }) => {
                                const date = item.dateOfEvent.split('T');
                                console.log(item, 'item')
                                // const Add= reverseGeocode(item.location.latitude,item.location.longitude)
                                // console.log(Add,'address');
                                return (
                                    <>
                                        <View style={styles.container2}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                                {
                                                    user?.profilePicture ?
                                                        <Image source={{ uri: user?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                                        :
                                                        <Image source={imagePath.Gola} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                                }
                                                <Text style={styles.charlie}>{user?.fullName || 'NA'}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={styles.eventtxt}><Text style={[styles.eventtxt, { color: '#333', fontWeight: '900' }]}>{item.name ? item.name : 'NA'}</Text>
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{ marginBottom: moderateScaleVertical(5) }}>
                                                <Text style={[styles.eventtxt, { fontWeight: '500' }]}>{item.description ? item.description.substring(0, 50) + '...' : 'NA'}</Text>
                                            </View>
                                            <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(2) }} />

                                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon name='location-pin' size={15} color={'red'} />
                                                    <Text style={[styles.eventtxt, { color: 'red' }]}>{Distance.toLocaleString().substring(0, 4)} km away </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <TouchableOpacity onPress={() => navigation.navigate(navigationStrings.SHOWONMAP, { Elocation: item.location, Ulocation: UserLocation })} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Image source={imagePath.Gmap} style={{ height: moderateScaleVertical(30), width: moderateScale(30) }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View> */}
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                                <Text style={styles.eventtxt}>Event Type</Text>
                                                <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.eventType ? item.eventType : 'NA'}</Text>
                                            </View>
                                            {
                                                item.amount !== 0 && item.amount !== null &&
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    <Text style={styles.eventtxt}>Amount</Text>
                                                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.amount ? item.amount : 'NA'} $</Text>
                                                </View>
                                            }
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <Text style={styles.eventtxt}>No. of People Required</Text>
                                                <Text style={[styles.eventtxt, { fontWeight: '800' }]}> Min: {item.minPeople ? item.minPeople : 'NA'}- Max: {item.maxPeople ? item.maxPeople : 'NA'}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <Text style={styles.eventtxt}>No. of Participant Approved</Text>
                                                <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.event.bookingsApproved}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <Text style={styles.eventtxt}>Date & Time</Text>
                                                <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{date ? date[0] : 'NA'}, {item.time.start ? item.time.start : 'NA'} - {item.time.end ? item.time.end : 'NA'}</Text>
                                            </View>
                                            <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                                <Text style={[styles.eventtxt, { fontWeight: '500', color: '#333' }]}>Images</Text>
                                                <ScrollView
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                    style={{ marginVertical: moderateScaleVertical(5) }}
                                                >
                                                    {item?.images ?
                                                        item?.images && item.images.map((item, index) => {
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
                                                {/* <View style={{ marginVertical: moderateScaleVertical(5), backgroundColor: '#FF7F7F', padding: moderateScale(10), borderRadius: moderateScale(5) }}>
                                                    <Text style={[styles.eventtxt, { fontWeight: '800', textTransform: 'capitalize', fontSize: textScale(18) }]}>Status</Text>
                                                    <Text style={[styles.eventtxt, { fontWeight: '500', textTransform: 'capitalize' }]}>{item.requestStatus ? item.requestStatus : 'NA'}</Text>
                                                </View> */}
                                            </View>
                                        </View>

                                    </>
                                )
                            }}
                        />
                    </View>
                </View>}
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: moderateScale(12),
        backgroundColor: '#F2F2F2'
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
    head1: {
        color: '#333',
        fontSize: scale(32),
        fontFamily: 'Roboto',
        fontWeight: '900'
    },
    head2: {
        color: '#4F4F4F',
        fontSize: scale(16),
        fontFamily: 'Roboto',
        fontWeight: '700'
    },
    textone: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(20),
        fontWeight: '800'


    }


});

//make this component available to the app
export default EventHosted;

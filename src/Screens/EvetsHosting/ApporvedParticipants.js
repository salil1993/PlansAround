//import liraries
import React, { Component, useState,useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, Image } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale, moderateScaleVertical, scale, textScale, height, width } from '../../styles/responsiveSize';
import Loader from '../../Components/Loader';
import imagePath from '../../constants/imagePath';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
// create a component
const ApprovedParticipants = ({route,navigation}) => {
    const Eid=route.params.EventId;
    console.log(Eid,'route se')
    const [LoadEvents, setLoadEvents] = useState(false);
    const [Event, setEvent] = useState([1, 1, 1]);
    useEffect(() => {
        getApprovedParticipants();
    }, [])
    const getApprovedParticipants = async () => {
        setLoadEvents(true)
        let usertoken = await getData('UserToken');

        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        axios.get(`https://plansaround-backend.vercel.app/api/mobile/my-event/event/${Eid}/booking-request?status=APPROVED`, { headers })
            .then((res) => {
                console.log(res, 'Approved participants')
                setEvent(res.data.bookings)
                setLoadEvents(false)
            }).
            catch((err) => {
                console.log(err)
                setLoadEvents(false)
            })
    }
    return (
        <WrapperContainer>
            <HeaderBack mainText='Approved Participants' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <View style={styles.container}>
                <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                        {
                            LoadEvents ? <Loader /> :
                                <FlatList
                                    ListEmptyComponent={<View style={{ flex: 1, height: height, width: width, justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontSize: scale(15), color: '#4F4F4F', fontWeight: '700' }}>There is no approved participants.</Text></View>}

                                    data={Event}
                                    renderItem={({ item, index }) => {
                                        console.log(item, 'ye aaya...')

                                        return (
                                            <>
                                                <View style={styles.container2}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                                        {
                                                            item?.user?.profilePicture ?
                                                                <Image source={{ uri: item?.user?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                                                :
                                                                <Image source={imagePath.Gola} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                                        }
                                                        <Text style={styles.charlie}>{item?.user?.fullName ? item?.user?.fullName : 'NA'}</Text>
                                                    </View>
                                                    {/* <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between' }}>
                                                        <View style={{ flex: 3 }}>
                                                            <ButtonComp text='Accept' style={{ height: moderateScale(45), backgroundColor: '#93dc5c', }} />
                                                        </View>
                                                        <View style={{ flex: 3, marginLeft: moderateScale(5) }}>
                                                            <ButtonComp text='Reject' style={{ height: moderateScale(45), backgroundColor: '#ff8a8a' }} />
                                                        </View>
                                                    </View> */}
                                                </View>

                                            </>
                                        )
                                    }
                                    }
                                />
                        }
                    </View>
                </View>
            </View>

        </WrapperContainer>
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
export default ApprovedParticipants;

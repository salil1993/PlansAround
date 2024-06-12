//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ButtonComp from '../../Components/ButtonComp';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import Snackbar from 'react-native-snackbar';
import { useNavigation } from '@react-navigation/native';
import navigationStrings from '../../Navigation/navigationStrings';
// create a component
const PendingRequestComponent = ({ item, index, getPendingRequests }) => {
    const navigation = useNavigation();
    const [Loading, setLoading] = useState(false);
    const [LoadingR, setLoadingR] = useState(false);


    const handleAccept = async (EventId, id) => {
        console.log('Accept', EventId, ',,,,,,', id)
        setLoading(true);
        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        axios.post(`https://plansaround-backend.vercel.app/api/mobile/my-event/${EventId}/update-booking-request-status/${id}`, {
            "status": "APPROVED"
        }, { headers })
            .then((res) => {
                console.log(res, 'approved pariticpants')
                setLoading(false);
                Snackbar.show({
                    text: `${res.data.updated.requestStatus}`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });
                getPendingRequests();
                // navigation.navigate(navigationStrings.PENIDNGREQUEST)
                // getPendingRequests();

                // setEvent(res.data.eventRequest)
                // setLoadEvents(false)
            }).
            catch((err) => {
                console.log(err)
                setLoading(false)
                Snackbar.show({
                    text: `${err.response.data.message}`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'red',
                    textColor: "#fff",
                });

            })
    }

    const handleReject = async (EventId, id) => {
        console.log('Accept', EventId, ',,,,,,', id)
        setLoadingR(true);
        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        axios.post(`https://plansaround-backend.vercel.app/api/mobile/my-event/${EventId}/update-booking-request-status/${id}`, {
            "status": "REJECTED"
        }, { headers })
            .then((res) => {
                console.log(res, 'approved pariticpants')
                setLoadingR(false);
                Snackbar.show({
                    text: `${res.data.updated.requestStatus}`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });
                getPendingRequests();
                // navigation.navigate(navigationStrings.PENIDNGREQUEST)


                // setEvent(res.data.eventRequest)
                // setLoadEvents(false)
            }).
            catch((err) => {
                console.log(err)
                setLoadingR(false)
                Snackbar.show({
                    text: `${err.response.data.message}`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'red',
                    textColor: "#fff",
                });
            })
    }


    return (
        <View style={styles.container2} index={index}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(navigationStrings.ORGPROFILE, { Profile: item?.user?._id })
                }}
                style={{ flexDirection: 'row', alignItems: 'center' }} >
                {
                    item?.user?.profilePicture ?
                        <Image source={{ uri: item?.user?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                        :
                        <Image source={imagePath.Gola} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                }
                <Text style={styles.charlie}>{item?.user?.fullName ? item?.user?.fullName : 'NA'}</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginVertical: moderateScaleVertical(15) }}>
                <View style={{ flex: 3 }}>
                    <ButtonComp isLoading={Loading} onPress={() => handleAccept(item.eventId, item._id)} text='Accept' style={{ height: moderateScale(45), backgroundColor: '#93dc5c', }} />
                </View>
                <View style={{ flex: 3, marginLeft: moderateScale(5) }}>
                    <ButtonComp isLoading={LoadingR} onPress={() => handleReject(item.eventId, item._id)} text='Reject' style={{ height: moderateScale(45), backgroundColor: '#ff8a8a' }} />
                </View>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
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
export default PendingRequestComponent;

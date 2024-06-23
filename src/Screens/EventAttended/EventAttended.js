//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, Image, TouchableOpacity, ScrollView, PermissionsAndroid, ToastAndroid } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale, moderateScaleVertical, scale, textScale, height, width } from '../../styles/responsiveSize';
import Loader from '../../Components/Loader';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import imagePath from '../../constants/imagePath';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'
import navigationStrings from '../../Navigation/navigationStrings';
import Modal from 'react-native-modal'
import QRCode from 'react-native-qrcode-svg';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from "react-native-fs";
import ButtonComp from '../../Components/ButtonComp';




// create a component
const EventsAttended = ({ navigation }) => {
    const CurrentUserLocation = useSelector((state) => state.persistedReducer.authSlice.userCurrentLocation);

    const [LoadEvents, setLoadEvents] = useState(false);
    const [Event, setEvent] = useState('');
    const [showQR, setshowQR] = useState(false);
    const [showDelete, setDelete] = useState(false);
    const [productQRref, setProductQRref] = useState(null);
    const [QRvalue, setQRvalue] = useState(" ")
    const [QrLoading, setQrLoading] = useState(false);
    const saveQrToDisk = async () => {
        // console.log('saved')

        if (Platform.OS === "android" &&
            (await hasAndroidPermission())) {
            return;
        }

        if (productQRref) {
            productQRref.toDataURL((data) => {
                let filePath = RNFS.CachesDirectoryPath + `/${QRvalue}.png`;
                RNFS.writeFile(filePath, data, 'base64')
                    .then((success) => {
                        return CameraRoll.save(filePath, 'photo')
                    })
                    .then(() => {
                        ToastAndroid.show('QRCode saved to gallery', ToastAndroid.LONG);
                    });
            });
        }
    }

    const hasAndroidPermission = async () => {
        const permission =
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const hasPermission =
            await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }
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
        axios.get(`https://plansaround-backend.vercel.app/api/mobile/my-event/event-requested?status=APPROVED`, { headers }, {
            "status": "ALL"
        })
            .then((res) => {
                console.log(res, 'ApprovedeventDetail screen')
                setEvent(res.data.eventRequest)
                setLoadEvents(false)
            }).
            catch((err) => {
                console.log(err)
                setLoadEvents(false)
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

    const handleSumbit = () => {
        // navigation.navigate(navigationStrings.WHERE_STUDY)
    }

    // const handleQrGenerate = () => {
    //     setshowQR(!showQR)
    // }
    return (
        <WrapperContainer>
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <HeaderBack mainText='Event’s Approved' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    {
                        LoadEvents ? <Loader /> :
                            <FlatList
                                ListEmptyComponent={<View style={{ flex: 1, height: height, width: width, justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontSize: scale(15), color: '#4F4F4F', fontWeight: '700' }}>There is no approved events.</Text></View>}
                                data={Event}
                                renderItem={({ item, index }) => {
                                    console.log(item, 'ye aaya aproved event...')
                                    const UserLocation = CurrentUserLocation;
                                    const Eventlocation = item.event.location;
                                    const Distance = calculateDistance(UserLocation.latitude, UserLocation.longitude, Eventlocation.coordinates[0], Eventlocation.coordinates[1])
                                    const date = item.event.dateOfEvent.split('T')
                                    const handleQrGenerate = () => {
                                        setQrLoading(true);
                                        // Set QR value based on the current event item
                                        console.log(item, 'qrcode k liye')
                                        // setQRvalue(JSON.stringify(item._id));
                                        setQRvalue(item._id);
                                        setshowQR(true); // Show the modal
                                        setQrLoading(false);
                                    };
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
                                                        <Text style={styles.eventtxt}><Text style={[styles.eventtxt, { color: '#333', fontWeight: '900' }]}>{item.event.name ? item.event.name : 'NA'}</Text>
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ marginBottom: moderateScaleVertical(5) }}>
                                                    <Text style={[styles.eventtxt, { fontWeight: '500' }]}>{item.event.description ? item.event.description.substring(0, 50) + '...' : 'NA'}</Text>
                                                </View>
                                                <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(2) }} />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Icon name='location-pin' size={15} color={'red'} />
                                                        <Text style={[styles.eventtxt, { color: 'red' }]}>{Distance.toLocaleString().substring(0, 4)} km away </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <TouchableOpacity onPress={() => navigation.navigate(navigationStrings.SHOWONMAP, { Elocation: item.event.location, Ulocation: UserLocation, type:'EventAttended' })} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Image source={imagePath.Gmap} style={{ height: moderateScaleVertical(30), width: moderateScale(30) }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                                    <Text style={styles.eventtxt}>Event Type</Text>
                                                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.event.eventType ? item.event.eventType : 'NA'}</Text>
                                                </View>
                                                {
                                                    item.event.amount !== 0 &&
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
                                                    <View style={{ marginVertical: moderateScaleVertical(5), backgroundColor: '#cfecf7', padding: moderateScale(10), borderRadius: moderateScale(5) }}>
                                                        <Text style={[styles.eventtxt, { fontWeight: '800', textTransform: 'capitalize', fontSize: textScale(18) }]}>Status</Text>
                                                        <Text style={[styles.eventtxt, { fontWeight: '500', textTransform: 'capitalize' }]}>{item.requestStatus ? item.requestStatus : 'NA'}</Text>
                                                    </View>
                                                    <ButtonComp isLoading={QrLoading} onPress={handleQrGenerate} midIcon={true} IconColor={'#fff'} iconName='qrcode' text='View QR' style={{ backgroundColor: '#005BD4', marginVertical: moderateScaleVertical(5) }} />
                                                </View>
                                            </View>
                                            <View>
                                                <Modal
                                                    // coverScreen={false}
                                                    isVisible={showQR}
                                                    backdropColor="#000"
                                                    backdropOpacity={0.5}
                                                    animationIn="zoomInDown"
                                                    animationOut="zoomOutUp"
                                                    animationInTiming={600}
                                                    animationOutTiming={600}
                                                    backdropTransitionInTiming={600}
                                                    backdropTransitionOutTiming={600}
                                                >
                                                    <View style={[styles.modalStyle, { minHeight: moderateScale(height / 1.8) }]}>
                                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Text style={styles.qrCode}>Scan the QR code</Text>
                                                            <TouchableOpacity onPress={() => setshowQR(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                                                        </View>
                                                        <View>
                                                            <Text style={[styles.qrCode, { color: '#4F4F4F', fontSize: scale(15), fontWeight: '600', lineHeight: scale(20) }]}>Show the QR code shown below to your Organiser to record your attendance to the event.</Text>
                                                        </View>
                                                        <View style={{ padding: moderateScale(10), justifyContent: 'center', alignItems: 'center', }}>
                                                            <QRCode
                                                                value={QRvalue}
                                                                size={180}
                                                                logo={imagePath.Logo}
                                                                logoSize={30}
                                                                logoBackgroundColor='transparent'
                                                                getRef={(c) => setProductQRref(c)}
                                                            />
                                                        </View>
                                                        <View>
                                                            <ButtonComp midImg={true} midimgPath={imagePath.download2} text='Download' style={{ backgroundColor: '#005BD4' }} onPress={() => saveQrToDisk()} />
                                                        </View>
                                                    </View>
                                                </Modal>
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
    qrCode: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(20),
        fontWeight: '700'
    },
    modalStyle: {
        backgroundColor: '#FFF',
        minHeight: moderateScale(height / 2.5),
        borderRadius: moderateScale(15),
        // borderTopLeftRadius: moderateScale(20),
        // borderTopRightRadius: moderateScale(20),
        // flex: 1,
        // flexDirection: 'column',
        justifyContent: 'space-between',
        padding: moderateScale(16)
    },


});

//make this component available to the app
export default EventsAttended;

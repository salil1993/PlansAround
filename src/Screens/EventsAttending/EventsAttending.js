//import liraries
import React, { Component, useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView, StatusBar, TouchableOpacity, Platform, PermissionsAndroid,
    ToastAndroid,
} from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale, height, width } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import HeaderBack from '../../Components/HeaderBack';
import Modal from 'react-native-modal'
import QRCode from 'react-native-qrcode-svg';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from "react-native-fs";






// create a component
const EventsAttending = ({ navigation }) => {
    
    const [showQR, setshowQR] = useState(false);
    const [showDelete, setDelete] = useState(false);
    const [productQRref, setProductQRref] = useState(null);
    const [QRvalue, setQRvalue] = useState("This QR is Generated By Zip42LAB pvt Ltd.")


    const handleSumbit = () => {
        // navigation.navigate(navigationStrings.WHERE_STUDY)
    }



    
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

    return (
        <WrapperContainer>
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <HeaderBack mainText='Event’s Attending' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <View style={styles.container}>
                <ScrollView>
                    <View
                        style={{
                            padding: moderateScale(10),
                            backgroundColor: '#fff', elevation: 2, borderRadius: moderateScale(10), marginVertical: moderateScaleVertical(10)
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={imagePath.bTennis} />
                                <Text style={{
                                    color: '#333', fontFamily: 'Roboto', fontSize: scale(14), fontWeight
                                        : '700', marginLeft: moderateScale(10)
                                }}>Badminton</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { setDelete(!showDelete) }}>
                                    <Image source={imagePath.trash} />
                                </TouchableOpacity>
                                <Image source={imagePath.download} style={{ marginHorizontal: moderateScale(10) }} />
                                <TouchableOpacity onPress={() => { setshowQR(!showQR) }}><Image source={imagePath.qr} /></TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                            <Image source={imagePath.frame2} />
                            <Text style={[styles.textone, { marginLeft: moderateScale(10) }]}>Charlie Harper</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500' }]}>Date & Time</Text>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700' }]}>20/08/2023, 08:30 PM</Text>
                        </View>
                        <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500', marginVertical: moderateScaleVertical(10) }]}>It’s about time you showed up.🔥► Featuring 26 million matches per day and over 60 billion matches in total🔥</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={imagePath.compass} />
                            <Text style={[styles.textone, { color: '#333', fontSize: scale(16), fontWeight: '800', marginLeft: scale(5) }]}>Address</Text>
                        </View>
                        <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700', marginVertical: moderateScaleVertical(8) }]}>A-102, 946 Brook Ranch, Italy, Geogia-45746</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={imagePath.down} />
                        </View>
                    </View>
                    <View
                        style={{
                            padding: moderateScale(10),
                            backgroundColor: '#fff', elevation: 2, borderRadius: moderateScale(10), marginVertical: moderateScaleVertical(10)
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={imagePath.bTennis} />
                                <Text style={{
                                    color: '#333', fontFamily: 'Roboto', fontSize: scale(14), fontWeight
                                        : '700', marginLeft: moderateScale(10)
                                }}>Badminton</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={imagePath.trash} />
                                <Image source={imagePath.download} style={{ marginHorizontal: moderateScale(10) }} />
                                <Image source={imagePath.qr} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                            <Image source={imagePath.frame2} />
                            <Text style={[styles.textone, { marginLeft: moderateScale(10) }]}>Charlie Harper</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500' }]}>Date & Time</Text>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700' }]}>20/08/2023, 08:30 PM</Text>
                        </View>
                        <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500', marginVertical: moderateScaleVertical(10) }]}>It’s about time you showed up.🔥► Featuring 26 million matches per day and over 60 billion matches in total🔥</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={imagePath.compass} />
                            <Text style={[styles.textone, { color: '#333', fontSize: scale(16), fontWeight: '800', marginLeft: scale(5) }]}>Address</Text>
                        </View>
                        <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700', marginVertical: moderateScaleVertical(8) }]}>A-102, 946 Brook Ranch, Italy, Geogia-45746</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={imagePath.down} />
                        </View>
                    </View>
                    <View >
                        <ButtonComp onPress={handleSumbit} text='Host an Event' style={{ backgroundColor: '#005BD4', marginTop: moderateScaleVertical(10) }} />
                    </View>
                    <View>
                        <Modal
                            // coverScreen={false}
                            isVisible={showQR}
                            backdropColor="#000"
                            backdropOpacity={0.8}
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
                                            getRef={(c)=>setProductQRref(c)}
                                        />
                                </View>
                                <View>
                                    <ButtonComp midImg={true} midimgPath={imagePath.download2} text='Download' style={{ backgroundColor: '#005BD4' }} onPress={()=>saveQrToDisk() } />
                                </View>
                            </View>
                        </Modal>
                    </View>
                    <View>
                        <Modal
                            isVisible={showDelete}
                            backdropColor="#000"
                            backdropOpacity={0.8}
                            animationIn="zoomInDown"
                            animationOut="zoomOutUp"
                            animationInTiming={600}
                            animationOutTiming={600}
                            backdropTransitionInTiming={600}
                            backdropTransitionOutTiming={600}
                        >
                            <View style={[styles.modalStyle, {}]}>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.qrCode}>Delete Event</Text>
                                    <TouchableOpacity onPress={() => setDelete(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                                </View>

                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={imagePath.deleteevent} style={{ height: moderateScale(100), width: moderateScale(100) }} />
                                </View>
                                <View>
                                    <Text style={[styles.qrCode, { color: '#4F4F4F', fontSize: scale(15), fontWeight: '600', lineHeight: scale(20), textAlign: 'center' }]}>Are you sure you want to delete this event made for Badminton on 20/08/2023 at 08:30PM?</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flex: 3 }}>
                                        <ButtonComp text='Cancel' style={{ height: moderateScale(45), borderColor: '#005BD4', borderWidth: 1 }} textStyle={{ color: '#005BD4' }} />
                                    </View>
                                    <View style={{ flex: 3, marginLeft: moderateScale(5) }}>
                                        <ButtonComp text='Continue' style={{ height: moderateScale(45), backgroundColor: '#005BD4' }} />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            </View>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(12),
        backgroundColor: '#F2F2F2'
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
    qrCode: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(20),
        fontWeight: '700'
    }


});

//make this component available to the app
export default EventsAttending;

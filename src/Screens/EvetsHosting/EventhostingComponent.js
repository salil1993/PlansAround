//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, Image, TouchableOpacity, ScrollView, Linking, Alert, PermissionsAndroid } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale, moderateScaleVertical, scale, textScale, height, width } from '../../styles/responsiveSize';
import Loader from '../../Components/Loader';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import imagePath from '../../constants/imagePath';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconUser from 'react-native-vector-icons/FontAwesome'
import navigationStrings from '../../Navigation/navigationStrings';
import Modal from 'react-native-modal'
import ButtonComp from '../../Components/ButtonComp';
import IconsComment from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native';


// create a component
const EventhostingComponent = ({ item, index, UserLocation, date, Distance, onShowQR, setDelete }) => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.persistedReducer.authSlice.userData);
    const [eventData, setEventData] = useState([])
    const [Loading, setLoading] = useState(false);
    const [scan, setScan] = useState(false);
    const [LoadEvent, setLoadEvent] = useState(false)
    const [showOptions, setShowOptions] = useState(false);


    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };





    console.log('item---->>>>', item)
    return (
        <>
            <View style={styles.container2}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        {
                            user?.profilePicture ?
                                <>
                                    <Image source={{ uri: user?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                </>
                                :
                                <>
                                    <Image source={imagePath.Gola} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                </>
                        }
                        <Text style={styles.charlie}>{user?.fullName || 'NA'}</Text>
                    </View>

                    <TouchableOpacity onPress={toggleOptions}>
                        {
                            item?.bookingsPending > 0 &&
                            <View style={{ backgroundColor: 'red', height: moderateScaleVertical(10), width: moderateScale(10), borderRadius: moderateScale(5), position: 'absolute', right: 3 }} />
                        }
                        <IconsComment name='dots-vertical' size={30} color='#333' />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.eventtxt}> <Text style={[styles.eventtxt, { color: '#333', fontWeight: '900' }]}>{item.name ? item.name : 'NA'}</Text>
                        </Text>
                    </View>
                </View>
                <View style={{ marginBottom: moderateScaleVertical(5) }}>
                    <Text style={[styles.eventtxt, { fontWeight: '500' }]}>{item.description ? item.description.substring(0, 50) + '...' : 'NA'}</Text>
                </View>
                <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(2) }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='location-pin' size={15} color={'red'} />
                        <Text style={[styles.eventtxt, { color: 'red' }]}>{Distance.toLocaleString().substring(0, 4)} km away </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate(navigationStrings.SHOWONMAP, { Elocation: item?.location, Ulocation: UserLocation, type: 'EventHosting' })
                            // openGoogleMaps(UserLocation, Eventlocation);
                        }}
                            style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={imagePath.Gmap} style={{ height: moderateScaleVertical(30), width: moderateScale(30) }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={styles.eventtxt}>Event Type</Text>
                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.eventType ? item.eventType : 'NA'}</Text>
                </View>
                {
                    item.amount !== 0 &&
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
                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>2</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <Text style={styles.eventtxt}>Date & Time</Text>
                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{date ? date[0] : 'NA'}, {item?.time?.start ? item?.time?.start : 'NA'} - {item?.time?.end ? item?.time?.end : 'NA'}</Text>
                </View>
                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                    <Text style={[styles.eventtxt, { fontWeight: '500', color: '#333' }]}>Images</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginVertical: moderateScaleVertical(5) }}
                    >
                        {item.images ?
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: moderateScaleVertical(5), alignItems: 'center' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.eventtxt}>Total Approved Participants</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate(navigationStrings.APPROVEDPARTICIPANTS, { EventId: item._id })} style={{ height: moderateScale(30), width: moderateScale(30), borderRadius: moderateScale(15), backgroundColor: '#93dc5c', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.eventtxt, { color: '#fff' }]}>{item?.bookingsApproved}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: moderateScaleVertical(5) }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.eventtxt}>Total Rejected Participants</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate(navigationStrings.REJECTEDPARTICIPANTS, { EventId: item._id })} style={{ height: moderateScale(30), width: moderateScale(30), borderRadius: moderateScale(15), backgroundColor: '#ff8a8a', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.eventtxt, { color: '#fff' }]}>{item?.bookingsRejected}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View>
                <Modal
                    isVisible={showOptions}
                    hasBackdrop={true}
                    backdropColor="#000"
                    backdropOpacity={0.5}
                    onBackdropPress={() => setShowOptions(false)}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                >
                    <View style={styles.modalStyle2}>

                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                            // setShowOptions(false);
                            // setDelete(!showDelete)
                            setDelete(), setShowOptions(false)
                        }}>

                            <IconsComment name='delete-outline' size={35} color='#333' style={{ width: '30%', textAlign: 'center' }} />
                            <Text style={[styles.eventtxt, { width: '80%', textAlign: 'center' }]}>Cancel Event</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: moderateScaleVertical(5) }} onPress={() => {
                            console.log('navigation clicked')
                            setShowOptions(false);
                            navigation.navigate(navigationStrings.EDITEVENT, { data: item })
                        }}>
                            <IconsComment style={{ width: '30%', textAlign: 'center' }} name='square-edit-outline' size={30} color='#333' />
                            <Text style={[styles.eventtxt, { width: '80%', textAlign: 'center' }]}>Edit Event</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}
                            onPress={() => { onShowQR(), setShowOptions(false) }}
                        >
                            <IconsComment style={{ width: '30%', textAlign: 'center' }} name='qrcode-scan' size={25} color='#333' />
                            <Text style={[styles.eventtxt, { width: '80%', textAlign: 'center' }]}>Scan Event</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: moderateScaleVertical(5) }} onPress={() => {
                            setShowOptions(false);
                            navigation.navigate(navigationStrings.PENIDNGREQUEST, { EventId: item._id })
                        }}>
                            <Text style={[styles.eventtxt, { color: 'red', position: 'absolute', left: 10, bottom: 15, fontWeight: 'bold' }]}>{item?.bookingsPending}</Text>
                            <IconUser style={{ width: '30%', textAlign: 'center' }} name='user-plus' size={25} color='#333' />
                            <Text style={[styles.eventtxt, { width: '80%', textAlign: 'center' }]}>Requests</Text>
                        </TouchableOpacity>

                    </View>
                </Modal>
            </View>

        </>
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
    modalStyle: {
        backgroundColor: '#FFF',
        minHeight: moderateScale(height / 2.5),
        borderRadius: moderateScale(15),
        justifyContent: 'space-between',
        padding: moderateScale(16)
    },
    modalStyle2: {

        width: '40%',
        backgroundColor: '#fff',
        position: 'absolute',
        right: 40,
        top: 50,
        borderRadius: 10,
        padding: moderateScale(15),
        zIndex: 1

    },
    qrCode: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(20),
        fontWeight: '700'
    }
});

//make this component available to the app
export default EventhostingComponent;

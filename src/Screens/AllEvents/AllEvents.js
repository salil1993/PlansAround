//import liraries
import React, { Component, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale, height } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import navigationStrings from '../../Navigation/navigationStrings';
import HeaderBack from '../../Components/HeaderBack';
import IconsComment from 'react-native-vector-icons/Fontisto'
import Modal from 'react-native-modal'
import Iconpaid from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';

// create a component
const WriteBio = ({ navigation }) => {
    const [scrollRef, setScrollRef] = useState(null);
    const UserKYCstatus = useSelector((state) => state.persistedReducer.authSlice.userData);
    const [Loading, setLoading] = useState(false)
    const [statusCounts, setStatusCounts] = useState(null);
    const [openoptionModal2, setoptionopenModal2] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            getAllEventList()
            if (scrollRef) {
                scrollRef.scrollTo({ y: 0, animated: true });
            }
        }, [scrollRef])
    );

    const getAllEventList = async () => {
        // if (isLoading) {
        //     return;
        // }
        // setIsLoading(true);
        try {
            let usertoken = await getData('UserToken');
            console.log('userToken', usertoken)
            const headers = {
                'Authorization': `Bearer ${usertoken}`,
                'Content-Type': "application/json",
            };

            const response = await axios.get(`https://plansaround-backend.vercel.app/api/mobile/my-event/`, { headers });
            const responseData = response.data;
            console.log('responseData--->>>', responseData)
            const bookingStatus = responseData?.bookingStatus;
            const initialStatusCounts = {
                APPROVED: 0,
                PENDING: 0,
                hostings: responseData.hostings || 0,
                hosted: responseData.hosted || 0,
                cancelled: responseData.cancelled || 0,
            };

            const statusCounts = bookingStatus.reduce((acc, status) => {
                if (status._id === 'APPROVED') {
                    acc.APPROVED = status.count;
                } else if (status._id === 'PENDING') {
                    acc.PENDING = status.count;
                } else if (status._id == "REJECTED") {
                    acc.rejected = status.count;
                }
                return acc;
            }, initialStatusCounts);

            console.log('statusCounts--->>>', statusCounts)
            setStatusCounts(statusCounts);
        } catch (error) {
            // setIsLoading(false);
            // setRefreshing(false);
            console.log("error", error);
        }
    };


    const handleSumbit = () => {
        setoptionopenModal2(!openoptionModal2)
        // navigation.navigate(navigationStrings.HOST_EVENT, { isLeftImage: true })
    }



    console.log('statusCounts-->>', statusCounts)
    return (
        <WrapperContainer>
            <StatusBar backgroundColor={'#fff'} />
            <View style={styles.container}>
                <HeaderBack mainText='My Events' isLeftImage={false} />
                <ScrollView showsVerticalScrollIndicator={false} ref={(ref) => setScrollRef(ref)}>
                    <View style={{ marginTop: moderateScaleVertical(10), flex: 0.9, justifyContent: 'space-between', }}>
                        <Image source={imagePath.Allevent} style={{ alignSelf: 'center', height: scale(110), width: scale(110) }} />
                        <Text style={[styles.head2, { marginTop: 10 }]}>As Participant</Text>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate(navigationStrings.EVENTREQUESTED)
                        }} style={{
                            marginVertical: moderateScaleVertical(10), flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: moderateScale(16),
                            borderTopColor: '#005BD4',
                            borderTopWidth: 3,
                            borderTopLeftRadius: moderateScale(5),
                            borderTopRightRadius: moderateScale(5),
                            borderBottomLeftRadius: moderateScale(15),
                            borderBottomRightRadius: moderateScale(15),
                            elevation: 1,
                            backgroundColor: '#fff',
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.head1}>{statusCounts?.PENDING}</Text>
                                <Text style={[styles.head2, { marginLeft: moderateScale(20) }]}>Event’s Requested</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* <IconsComment name='comment' size={20} color='#333' style={{ marginHorizontal: moderateScale(10) }} /> */}
                                <Image source={imagePath.arright} tintColor={'#4F4F4F'} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            navigation.navigate(navigationStrings.EVENTREJECTED)
                        }} style={{
                            marginVertical: moderateScaleVertical(10), flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: moderateScale(16),
                            borderTopColor: '#005BD4',
                            borderTopWidth: 3,
                            borderTopLeftRadius: moderateScale(5),
                            borderTopRightRadius: moderateScale(5),
                            borderBottomLeftRadius: moderateScale(15),
                            borderBottomRightRadius: moderateScale(15),
                            elevation: 1,
                            backgroundColor: '#fff'
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.head1}>{statusCounts?.rejected || 0}</Text>
                                <Text style={[styles.head2, { marginLeft: moderateScale(20) }]}>Event’s Request Rejected </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* <IconsComment name='comment' size={20} color='#333' style={{ marginHorizontal: moderateScale(10) }} /> */}
                                <Image source={imagePath.arright} tintColor={'#4F4F4F'} />
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate(navigationStrings.EVENTCANCELED)
                        }} style={{
                            marginVertical: moderateScaleVertical(10), flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: moderateScale(16),
                            borderTopColor: '#005BD4',
                            borderTopWidth: 3,
                            borderTopLeftRadius: moderateScale(5),
                            borderTopRightRadius: moderateScale(5),
                            borderBottomLeftRadius: moderateScale(15),
                            borderBottomRightRadius: moderateScale(15),
                            elevation: 1,
                            backgroundColor: '#fff',
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.head1}>{statusCounts?.cancelled || 0}</Text>
                                <Text style={[styles.head2, { marginLeft: moderateScale(20) }]}>Event’s Canceled</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* <IconsComment name='comment' size={20} color='#333' style={{ marginHorizontal: moderateScale(10) }} /> */}
                                <Image source={imagePath.arright} tintColor={'#4F4F4F'} />
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate(navigationStrings.EVENTS_ATTENDED) }} style={{
                            marginVertical: moderateScaleVertical(10), flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: moderateScale(16),
                            borderTopColor: '#005BD4',
                            borderTopWidth: 3,
                            borderTopLeftRadius: moderateScale(5),
                            borderTopRightRadius: moderateScale(5),
                            borderBottomLeftRadius: moderateScale(15),
                            borderBottomRightRadius: moderateScale(15),
                            elevation: 1,
                            backgroundColor: '#fff',
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.head1}>{statusCounts?.APPROVED || 0}</Text>
                                <Text style={[styles.head2, { marginLeft: moderateScale(20) }]}>Event’s Approved</Text>
                            </View>
                            <Image source={imagePath.arright} tintColor={'#4F4F4F'} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => { navigation.navigate(navigationStrings.PAST_EVENTS) }} style={{
                            marginVertical: moderateScaleVertical(10), flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: moderateScale(16),
                            borderTopColor: '#005BD4',
                            borderTopWidth: 3,
                            borderTopLeftRadius: moderateScale(5),
                            borderTopRightRadius: moderateScale(5),
                            borderBottomLeftRadius: moderateScale(15),
                            borderBottomRightRadius: moderateScale(15),
                            elevation: 1,
                            backgroundColor: '#fff',
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.head1}>{0}</Text>
                                <Text style={[styles.head2, { marginLeft: moderateScale(20) }]}>Event’s Attended</Text>
                            </View>
                            <Image source={imagePath.arright} tintColor={'#4F4F4F'} />
                        </TouchableOpacity>
                        <Text style={[styles.head2, { marginTop: 10 }]}>As Organiser</Text>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(navigationStrings.EVENTS_HOSTING)

                            }}
                            style={{
                                marginVertical: moderateScaleVertical(10), flexDirection: 'row', justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: moderateScale(16),
                                borderTopColor: '#005BD4',
                                borderTopWidth: 3,
                                borderTopLeftRadius: moderateScale(5),
                                borderTopRightRadius: moderateScale(5),
                                borderBottomLeftRadius: moderateScale(15),
                                borderBottomRightRadius: moderateScale(15),
                                elevation: 1,
                                backgroundColor: '#fff'
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.head1}>{statusCounts?.hostings || 0}</Text>
                                <Text style={[styles.head2, { marginLeft: moderateScale(20) }]}>Event’s Hosting</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <IconsComment name='comment' size={20} color='#333' style={{ marginHorizontal: moderateScale(10) }} />
                                <Image source={imagePath.arright} tintColor={'#4F4F4F'} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate(navigationStrings.EVENTS_HOSTED) }} style={{
                            marginVertical: moderateScaleVertical(10), flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: moderateScale(16),
                            borderTopColor: '#005BD4',
                            borderTopWidth: 3,
                            borderTopLeftRadius: moderateScale(5),
                            borderTopRightRadius: moderateScale(5),
                            borderBottomLeftRadius: moderateScale(15),
                            borderBottomRightRadius: moderateScale(15),
                            elevation: 1,
                            backgroundColor: '#fff'
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.head1}>{statusCounts?.hosted || 0}</Text>
                                <Text style={[styles.head2, { marginLeft: moderateScale(20) }]}>Event’s Hosted</Text>
                            </View>
                            <Image source={imagePath.arright} tintColor={'#4F4F4F'} />
                        </TouchableOpacity>
                        <View >
                            <ButtonComp onPress={handleSumbit} text='Host an Event' style={{ backgroundColor: '#005BD4', marginVertical: moderateScaleVertical(10), marginBottom: moderateScaleVertical(10) }} />
                        </View>
                    </View>
                </ScrollView>
            </View>
            <View>
                <Modal
                    // coverScreen={false}
                    isVisible={openoptionModal2}
                    backdropColor="#000"
                    hasBackdrop={true}
                    backdropOpacity={UserKYCstatus?.kyc?.isVerified ? 0.8 : 1}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={800}
                    animationOutTiming={800}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                    style={{ justifyContent: 'flex-end', margin: 0 }}
                >
                    <View style={styles.modalStyle2}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.hometxt}>Choose Event Type</Text>
                            </View>
                            <TouchableOpacity onPress={() => setoptionopenModal2(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: '#ffff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(10) }}>
                            <TouchableOpacity disabled={UserKYCstatus?.kyc?.isVerified ? false : true} onPress={() => {
                                setoptionopenModal2(false)
                                UserKYCstatus.packageValidTill !== null ? navigation.navigate(navigationStrings.HOST_EVENT, { isPaid: true, modal: false, EventType: 'PAID' }) : navigation.navigate(navigationStrings.ALLPLANS)
                            }}
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <Text style={styles.txt}>Paid Event</Text>
                                <Iconpaid name='paid' size={30} color={'#005BD4'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: '#ffff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(5) }}>
                            <TouchableOpacity disabled={UserKYCstatus?.kyc?.isVerified ? false : true} onPress={() => {
                                setoptionopenModal2(false)
                                navigation.navigate(navigationStrings.HOST_EVENT, { isLeftImage: true, modal: false, EventType: 'FREE' })
                            }
                            } style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <Text style={styles.txt}>Free Event</Text>
                                <Iconpaid name='try' size={30} color={'#005BD4'} />
                            </TouchableOpacity>
                        </View>
                        {
                            UserKYCstatus?.kyc?.isVerified ? <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: moderateScaleVertical(10) }}>
                                <Image source={imagePath.kycN} resizeMode='contain' style={{ height: moderateScaleVertical(30), width: moderateScale(30), }} />
                                <Text style={[styles.phoneHeading, { fontSize: moderateScale(15), color: 'green', marginLeft: moderateScale(10), fontFamily: 'Roboto' }]}>KYC VERIFIED</Text>
                            </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => {
                                    setoptionopenModal2(false)
                                    navigation.navigate(navigationStrings.REKYC)
                                }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: moderateScaleVertical(10) }}>
                                    <Image source={imagePath.kycN} resizeMode='contain' style={{ height: moderateScaleVertical(30), width: moderateScale(30), }} />
                                    <Text style={[styles.phoneHeading, { fontSize: moderateScale(15), color: 'red', marginLeft: moderateScale(10), fontFamily: 'Roboto' }]}>KYC REQUIRED</Text>
                                </TouchableOpacity>
                        }

                    </View>
                </Modal>
            </View>
        </WrapperContainer>
    );
}


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(12),
        backgroundColor: '#fff'
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
    modalStyle2: {
        backgroundColor: '#F2F2F2',
        minHeight: moderateScale(height / 4),
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        padding: moderateScale(15)
    },
    hometxt: {
        color: '#333',
        fontSize: scale(22),
        fontFamily: 'Roboto',
        fontWeight: '800'
    },
    txt: {
        color: '#4F4F4F',
        fontFamily: 'Poppins',
        fontSize: scale(16),
        fontWeight: '700'
    }


});

//make this component available to the app
export default WriteBio;

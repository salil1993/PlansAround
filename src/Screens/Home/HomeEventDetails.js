//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale, moderateScaleVertical, textScale, scale, height } from '../../styles/responsiveSize';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import Loader from '../../Components/Loader';
import ButtonComp from '../../Components/ButtonComp';
import imagePath from '../../constants/imagePath';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from 'react-redux';
import navigationStrings from '../../Navigation/navigationStrings';
import Snackbar from 'react-native-snackbar';
import Modal from 'react-native-modal'
import { RequestBooking } from '../../API/Api';
// create a component
const HomeEventDetails = ({ navigation, route }) => {
    const CurrentUserLocation = useSelector((state) => state.persistedReducer.authSlice.userCurrentLocation);
     const User = useSelector((state) => state.persistedReducer.authSlice.userData);
    const [Event, setEvent] = useState();
    const [EventId, setEventId] = useState(null);
    const [LoadEvent, setLoadEvent] = useState(false)
    const [Loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [askPermission, setaskPermission] = useState(false);

    const openImage = (image) => {
        setSelectedImage(image);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };
    // console.log(route,'details pr')
    const Id = route.params.Id;
    // console.log(Id, 'details pr')
    useEffect(() => {
        getEvent();
    }, [])
    const getEvent = async () => {
        setLoadEvent(true)
        // setLoadEvent(true)
        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': 'multipart/form-data',
        };
        axios.get(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/${Id}`, { headers })
            .then((res) => {
                console.log(res, 'eventDetail on homese')
                setEvent(res.data.eventDetail)
                setLoadEvent(false)

                // setEventData(res.data.events)
                // setLoadEvent(false)
            }).
            catch((err) => {
                console.log(err)
                // setLoadEvent(false)
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


    const HanldeCheckParticipate = () => {

        if (User.kyc?.isVerified) {
            setaskPermission(true)
        }
        else {
            console.log('kyc not verified')
            Snackbar.show({
                text: 'Please update your KYC',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                textColor: "#fff",
                numberOfLines: 3,
                action: {
                    text: 'KYC',
                    textColor: '#ffff',
                    onPress: () => { navigation.navigate(navigationStrings.REKYC) },
                },
            });

        }
    }

    const HandleParticpate = (eventId) => {
      //  setLoading(true)
        console.log('kyc verified')
        console.log(eventId, 'eventId')
        RequestBooking(eventId)
            .then((res) => {
                console.log(res, 'eventBooking')
                setLoading(false)
                setaskPermission(false);
                setTimeout(() => {
                    Snackbar.show({
                        text: `${res.message}`,
                        duration: Snackbar.LENGTH_INDEFINITE,
                        backgroundColor: '#005BD4',
                        action: {
                            text: 'Ok',
                            textColor: "#fff",
                            onPress: () => { Snackbar.dismiss() },
                        },
                    });
                    getEvent();
                }, 1000);

            })
            .catch((err) => {
                console.log(err, 'eventBooking')
                setLoading(false);
                setaskPermission(false);
                setTimeout(() => {
                    Snackbar.show({
                        text: `${err.response.data.message}`,
                        duration: Snackbar.LENGTH_INDEFINITE,
                        backgroundColor: 'red',
                        action: {
                            text: 'Ok',
                            textColor: "#fff",
                            onPress: () => { Snackbar.dismiss() },
                        },
                    });
                }, 2000);
            })
    }

    return (
        <WrapperContainer>
            <HeaderBack mainText='Event Details' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />

            {LoadEvent ? <Loader /> :
                <SafeAreaView style={styles.container}>
                    {Event &&
                        <FlatList
                            data={[Event]}
                            renderItem={({ item, index }) => {
                                const UserLocation = CurrentUserLocation;
                                const Eventlocation = item.location;
                                const Distance = calculateDistance(UserLocation.latitude, UserLocation.longitude, Eventlocation.latitude, Eventlocation.longitude)
                                const date = item.dateOfEvent.split('T')
                                return (
                                    <>
                                        <View style={styles.container2} key={index}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                                <TouchableOpacity onPress={() => navigation.navigate(navigationStrings.ORGPROFILE, { Profile: item?.userId })} style={{ flexDirection: 'row', alignItems: 'center' }} >
                                                    {
                                                        item?.user?.profilePicture ?
                                                            <Image source={{ uri: item?.user?.profilePicture }} style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25), resizeMode: 'contain' }} />
                                                            :
                                                            <Image source={imagePath.Gola} style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25), resizeMode: 'contain' }} />
                                                    }
                                                    <Text style={styles.charlie}>{item.user.fullName ? item.user.fullName : 'NA'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={styles.eventtxt}>Made an event for <Text style={[styles.eventtxt, { color: '#333', fontWeight: '900' }]}>{item.name ? item.name : 'NA'}</Text>
                                                    </Text>
                                                    {item.subCategory.icon ?
                                                        <Image source={{ uri: item.subCategory.icon }} style={{ height: moderateScale(20), width: moderateScale(20), borderRadius: moderateScale(10), marginLeft: moderateScale(8) }} resizeMode='contain' />
                                                        :
                                                        <Image source={imagePath.bTennis} />
                                                    }
                                                </View>
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
                                                                    <TouchableOpacity key={index} onPress={() => openImage(item)}>
                                                                        <Image source={{ uri: item }} style={{ borderRadius: scale(5), height: moderateScale(50), width: moderateScale(50), }} resizeMode='contain' />
                                                                    </TouchableOpacity>
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

                                            </View>
                                            <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(2) }} />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <Text style={styles.eventtxt}>Event Category</Text>
                                                <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.category.name ? item.category.name : 'NA'}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <Text style={styles.eventtxt}>Event SubCategory</Text>
                                                <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.subCategory.name ? item.subCategory.name : 'NA'}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <Text style={styles.eventtxt}>Event Type</Text>
                                                <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.eventType ? item.eventType : 'NA'}</Text>
                                            </View>
                                            {
                                                item?.amount && item?.amount !== 0
                                                    ?
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                        <Text style={styles.eventtxt}>Amount</Text>
                                                        <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.amount ? item.amount : 'NA'} $</Text>
                                                    </View>
                                                    :
                                                    <>
                                                    </>
                                            }

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon name='location-pin' size={15} color={'red'} />
                                                    <Text style={[styles.eventtxt, { color: 'red' }]}>{Distance.toLocaleString().substring(0, 4)} km away </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Image source={imagePath.Gmap} style={{ height: moderateScaleVertical(20), width: moderateScale(20) }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <Text style={styles.eventtxt}>No. of people required (Max)</Text>
                                                <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.maxPeople ? item.maxPeople : 'NA'}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <Text style={styles.eventtxt}>No. of people required (Min)</Text>
                                                <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.minPeople ? item.minPeople : 'NA'}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                <Text style={styles.eventtxt}>Date & Time</Text>
                                                <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{date ? date[0] : 'NA'}, {item.time.start ? item.time.start : 'NA'} - {item.time.end ? item.time.end : 'NA'}</Text>
                                            </View>
                                            <View style={{ marginBottom: moderateScaleVertical(5) }}>
                                                <Text style={[styles.eventtxt, { fontWeight: '500' }]}>{item.description ? item.description : 'NA'}</Text>
                                            </View>

                                            <ButtonComp text='Participate'
                                                style={{ backgroundColor: '#005BD4', width: '100%' }} onPress={() => {
                                                    setEventId(item?._id)
                                                    setTimeout(() => {
                                                        HanldeCheckParticipate();
                                                    }, 1000);
                                                }
                                                } />
                                            {/* <Modal
                                        swipeDirection={'down'}
                                        onSwipeStart={() => setopenModal(false)}
                                        hasBackdrop={true}
                                        coverScreen={true}
                                        backdropColor="#000"
                                        backdropOpacity={0.4}
                                        onBackdropPress={() => setopenModal(false)}
                                        isVisible={openModal}
                                        style={{ justifyContent: 'flex-end', margin: 0, }}
                                        animationIn="slideInUp"
                                        animationOut="slideOutDown"
                                        animationInTiming={1000}
                                        animationOutTiming={1000}
                                        backdropTransitionInTiming={600}
                                        backdropTransitionOutTiming={600}
                                    >
                                        <View style={styles.modalStyle}>
                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image source={imagePath.frame2} />
                                                    <Text style={[styles.hometxt, { marginLeft: moderateScale(5) }]}>Charlie Harper</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => setopenModal(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                                            </View>
                                            <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(15) }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                                    <Text style={styles.txt}>Visit Organiser Profile</Text>
                                                    <IconsLike name='user' size={20} color='#4F4F4F' />
                                                </View>
                                                <View style={{
                                                    borderWidth: 0.2, borderBottomColor: '#BDBDBD'
                                                }} />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                                    <Text style={styles.txt}>Share</Text>
                                                    <IconsLike name='sharealt' size={20} color='#4F4F4F' />
                                                </View>
                                                <View style={{
                                                    borderWidth: 0.2, borderBottomColor: '#BDBDBD'
                                                }} />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                                    <Text style={styles.txt}>Mark as Favourite</Text>
                                                    <IconsLike name='hearto' size={20} color='#4F4F4F' />
                                                </View>
                                                <View style={{
                                                    borderWidth: 0.2, borderBottomColor: '#BDBDBD'
                                                }} />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                                    <Text style={styles.txt}>Save the Event Post</Text>
                                                    <Icons name='save' size={20} color='#4F4F4F' />
                                                </View>
                                                <View style={{
                                                    borderWidth: 0.2, borderBottomColor: '#BDBDBD'
                                                }} />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                                    <Text style={styles.txt}>Follow</Text>
                                                    <IconsLike name='adduser' size={20} color='#4F4F4F' />
                                                </View>
                                                <View style={{
                                                    borderWidth: 0.2, borderBottomColor: '#BDBDBD'
                                                }} />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                                    <Text style={styles.txt}>Report a Problem</Text>
                                                    <IconsLike name='exclamationcircleo' size={20} color='#EB5757' />
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                    <Modal

                                        // swipeDirection={'down'}
                                        // onSwipeStart={() => setopenCommentModal(false)}
                                        hasBackdrop={true}
                                        coverScreen={true}
                                        backdropColor="#000"
                                        backdropOpacity={0.5}
                                        onBackdropPress={() => setopenCommentModal(false)}
                                        isVisible={openCommentModal}
                                        style={{ justifyContent: 'flex-end', margin: 0, }}
                                        animationIn="slideInUp"
                                        animationOut="slideOutDown"
                                        animationInTiming={800}
                                        animationOutTiming={800}
                                        backdropTransitionInTiming={600}
                                        backdropTransitionOutTiming={600}
                                        scrollTo={(p) => handleScrollTo(p)}
                                        scrollOffset={offset}
                                        scrollOffsetMax={400 - 300}
                                        propagateSwipe={true}
                                    >
                                        <View style={[styles.modalStyle, { height: 300 }]}>
                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={[styles.hometxt, { marginLeft: moderateScale(5), fontSize: moderateScale(16) }]}>Comments</Text>

                                                </View>
                                                <TouchableOpacity onPress={() => setopenCommentModal(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                                            </View>
                                            <ScrollView
                                                ref={scrollViewRef}
                                                scrollEventThrottle={16}
                                                onScroll={(e) => handleOnScroll(e)}
                                                style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(15) }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    <Image source={imagePath.frame2} />
                                                    <View>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(18) }]}>Charlie Harper</Text>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(14), fontWeight: '400' }]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit............</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    <Image source={imagePath.frame2} />
                                                    <View>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(18) }]}>Charlie Harper</Text>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(14), fontWeight: '400' }]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit............</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    <Image source={imagePath.frame2} />
                                                    <View>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(18) }]}>Charlie Harper</Text>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(14), fontWeight: '400' }]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit............</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    <Image source={imagePath.frame2} />
                                                    <View>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(18) }]}>Charlie Harper</Text>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(14), fontWeight: '400' }]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit............</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    <Image source={imagePath.frame2} />
                                                    <View>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(18) }]}>Charlie Harper</Text>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(14), fontWeight: '400' }]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit............</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    <Image source={imagePath.frame2} />
                                                    <View>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(18) }]}>Charlie Harper</Text>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(14), fontWeight: '400' }]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit............</Text>
                                                    </View>
                                                </View>
                                            </ScrollView>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(500), padding: moderateScale(10) }}>
                                                    <IconsLike name='tag' color='#005BD4' size={25} />
                                                </View>
                                                <View style={{ marginLeft: moderateScale(8), flex: 1 }}>
                                                    <TextInputC
                                                        placeholder={'Leave your comment'}
                                                        autoFocus={true}
                                                        iconname={'send'}
                                                        isrightIcon={true}
                                                        style={{ borderRadius: moderateScale(30) }} />
                                                </View>

                                            </View>
                                        </View>
                                    </Modal> */}
                                        </View>
                                    </>
                                )
                            }
                            }

                        />

                    }
                    <View>
                        <Modal isVisible={selectedImage !== null}    backdropColor="#000"
                         backdropOpacity={0.8}
                         hasBackdrop={true}
                         animationOutTiming={900}>
                            <SafeAreaView style={styles.modalContainer}>
                                <TouchableOpacity style={styles.closeButton} onPress={closeImage}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                                <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
                            </SafeAreaView>
                        </Modal>
                    </View>
                    <View>
                        <Modal
                         isVisible={askPermission}
                         backdropColor="#000"
                         backdropOpacity={0.8}
                         hasBackdrop={true}
                         animationOutTiming={900}
                        >
                            <View style={styles.PermissionmodalStyle}>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {/* <Text style={styles.qrCode}>Delete Event</Text> */}<View />
                                    <TouchableOpacity onPress={() => setaskPermission(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={imagePath.demand} style={{ height: moderateScale(100), width: moderateScale(100) }} />
                                </View>
                                <View>
                                    <Text style={[styles.qrCode, { color: '#4F4F4F', fontSize: scale(15), fontWeight: '600', lineHeight: scale(20), textAlign: 'center' }]}>Are you sure you want to send Request to admin for participation in this event. </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flex: 3 }}>
                                        <ButtonComp text='Cancel' onPress={() => setaskPermission(false)} style={{ height: moderateScale(45), borderColor: '#005BD4', borderWidth: 1 }} textStyle={{ color: '#005BD4' }} />
                                    </View>
                                    <View style={{ flex: 3, marginLeft: moderateScale(5) }}>
                                        <ButtonComp isLoading={Loading} onPress={() => HandleParticpate(EventId)} text='Continue' style={{ height: moderateScale(45), backgroundColor: '#005BD4' }} />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </SafeAreaView>
            }
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(12),
        backgroundColor: '#F2F2F2',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    container2: {
        flex: 1,
        padding: moderateScale(12),
        backgroundColor: '#Fff',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    phoneHeading: {
        fontSize: textScale(24),
        fontFamily: 'Roboto',
        fontWeight: '800',
        color: '#333'
    },
    phoneHeading2: {
        fontSize: textScale(14),
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: '#4F4F4F'
    },
    charlie: {
        color: '#333',
        fontSize: textScale(20),
        fontFamily: 'Roboto',
        fontWeight: '700',
        marginLeft: moderateScale(10)
    },
    eventtxt: {
        color: '#4F4F4F',
        fontSize: textScale(16),
        fontWeight: '500'
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: moderateScaleVertical(10),
    },
    imageThumbnail: {
        width: 100,
        height: 100,
        margin: 5,
    },
    modalContainer: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    fullScreenImage: {
        height: '80%',
        width: '80%',
        resizeMode: 'contain',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginRight: moderateScale(20)
    },
    closeButtonText: {
        color: 'white',
        fontSize: textScale(16),
        fontFamily: 'Roboto',
        fontWeight: '700',
    },
    PermissionmodalStyle: {
        backgroundColor: '#FFF',
        minHeight: moderateScale(height / 2.5),
        borderRadius: moderateScale(15),
        justifyContent: 'space-between',
        padding: moderateScale(16)
    },
});

//make this component available to the app
export default HomeEventDetails;

//import liraries
import React, { Component, useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, StatusBar, ActivityIndicator, Image, RefreshControl, ScrollView, TouchableOpacity, TouchableOpacityComponent, Alert, Platform, PermissionsAndroid } from 'react-native';
import { moderateScale, moderateScaleVertical, scale, height, textScale, width } from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import ButtonComp from '../../Components/ButtonComp';
import WrapperContainer from '../../Components/WrapperContainer';
import Modal from 'react-native-modal'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/Feather'
import IconsLike from 'react-native-vector-icons/AntDesign'
import TextInputC from '../../Components/TextInputC';
import SearchPlaces from '../../Components/SearchPlaces';
import IconsettingClose from 'react-native-vector-icons/MaterialCommunityIcons'
import Slider from '@react-native-community/slider';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { userCurrentLocation } from '../../redux/Slices/UserSlice';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import HomeEvent from '../../Components/HomeEvent';
import navigationStrings from '../../Navigation/navigationStrings';


// create a component
const Home = () => {
    const dispatch = useDispatch();
    const scrollViewRef = useRef();
    const navigation = useNavigation();
    const CurrentUserLocation = useSelector((state) => state.persistedReducer.authSlice.userCurrentLocation);
    const User = useSelector((state) => state.persistedReducer.authSlice.userData);
    // console.log(CurrentUserLocation, 'user---->>')
    const { latitude, longitude } = CurrentUserLocation;
    const searchRef = useRef(null)
    const [address, setAddress] = useState(null);
    const [CurrentLocation, setCurrentLocation] = useState(CurrentUserLocation)
    const [value, setvalue] = useState('');
    const [selected, setselected] = useState('All');
    const [Range, setRange] = useState('')
    const [FilterOpen, setFilterOpen] = useState(false);
    const [openLocationModal, setLocationModal] = useState(false);
    const [Gcategory, setGcategory] = useState(1)
    const [LoadEvents, setLoadEvents] = useState(false);

    const [categoryName, setCategoryName] = useState("")
    const [Loading, setLoading] = useState(false)

    const [EventsList, setEventsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);



    useEffect(() => {
        requestLocationPermission()
        getEventList(1);
        if (User) {
            reverseGeocode(User?.location?.latitude, User?.location?.longitude);
            var latitude = User?.location?.latitude;
            var longitude = User?.location?.longitude;
            dispatch(userCurrentLocation({ latitude, longitude }))
            setCurrentLocation({ latitude, longitude })
            setLoading(false)
        }
    }, [])

    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'ios') {
                // No need to request permission on iOS
                getCurrentLocation();
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    console.log('Location permission denied');
                }
            }
        } catch (error) {
            console.error('Error requesting location permission: ', error);
        }
    };

    const getCurrentLocation = () => {
        setLoading(true);
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                console.log('Current Location:', { latitude, longitude });
                setCurrentLocation({ latitude, longitude })
                dispatch(userCurrentLocation({ latitude, longitude }))
                reverseGeocode(latitude, longitude);

                setLoading(false);
            },
            error => {
                console.error('Error getting location: ', error);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };


    const radioButtons = useMemo(() => ([
        {

            value: 'All',
            label: 'All'
        },
        {
            value: 'Free',
            label: 'Free'
        },
        {

            value: 'Paid',
            label: 'Paid'
        },
    ]), []);
    const handleSelect = (label) => {
        setselected(label)
    }


    const handleCategory = (id) => {
        setGcategory(id)
    }

    const category = [{
        id: 1,
        cat: 'All'
    },
    {
        id: 2,
        cat: 'In your range'
    },
    {
        id: 3,
        cat: 'Following'
    },
    {
        id: 4,
        cat: 'Followers'
    },
    ]

    const reverseGeocode = async (latitude, longitude) => {
        // const apiKey = 'AIzaSyBWnqaUowVdjnPVHJAdLf0MMBgQRm6NMpc';
        const apiKey = 'AIzaSyDoIp9EAqQ10AGtqcgNm6TWndqvUgroHJk';
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
        console.log('apiUrl', apiUrl)
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log(data, 'addrress')

            if (data.results && data.results.length > 0) {
                const formattedAddress = data.results[0].formatted_address;
                setAddress(formattedAddress);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const onSearchhandle = (data, details) => {
        setLoading(true)
        console.log(details.geometry.location, 'NewLocationyhaHOme change')
        // console.log(details, 'NewLocationyhaHOme p change')
        const selectedLocation = details.geometry.location;
        const { lat, lng } = selectedLocation;
        const latitude = lat;
        const longitude = lng;
        setCurrentLocation({ latitude, longitude });
        dispatch(userCurrentLocation({ latitude, longitude }))
        reverseGeocode(latitude, longitude);
        setLoading(false)
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



    const getEventList = async (pageNumber) => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        try {
            let usertoken = await getData('UserToken');
            console.log('userToken', usertoken)
            const headers = {
                'Authorization': `Bearer ${usertoken}`,
                'Content-Type': "application/json",
            };

            const url = `https://plansaround-backend.vercel.app/api/mobile/homepage/events?page=${pageNumber}&search=${categoryName}&eventType=${selected.toUpperCase()}`
            console.log("url====", url);
            const response = await axios.get(url, { headers });
            const responseData = response.data;
            console.log(responseData, 'totalevents')
            const newEvents = responseData?.events;
            setEventsList((prevEvents) => {
                if (pageNumber === 1) {
                    // If it's the first page, replace existing events
                    return newEvents;
                } else {
                    // If it's not the first page, append new events to the existing list
                    return [...prevEvents, ...newEvents];
                }
            });
            setPage(pageNumber); // Update the current page number
            setIsLoading(false);
            setRefreshing(false);
            setHasMore(newEvents?.length > 0); // Update hasMore based on whether new events were fetched
        } catch (error) {
            setIsLoading(false);
            setRefreshing(false);
            console.log(error);
        }
    };

    // Define your function for handling load more
    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            getEventList(page + 1);
        }
    };

    // Define your function for handling pull-to-refresh
    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        getEventList(1);
    };



    const LoaderList = () => (
        <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#005BD4" />
            <Text style={[styles.eventtxt, { color: '#005BD4' }]}>Loading</Text>
        </View>
    );



    console.log("searchRef====", searchRef);
    return (
        <WrapperContainer>
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <View style={{ padding: moderateScale(12), backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.1, }}>
                        <TouchableOpacity onPress={() => setLocationModal(true)}>
                            <Icon name='location-pin' size={28} color={'#005BD4'} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setLocationModal(true)} style={{ flex: 0.8, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.hometxt}>Home</Text>
                            <Icon name='keyboard-arrow-down' size={28} color={'#4F4F4F'} />
                        </View>
                        <Text style={styles.address}>{address}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', flex: 0.2, justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(navigationStrings.NOTIFICATION_LIST)
                            }}>
                            <Icon name='notifications-none' size={30} color={'#4F4F4F'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setFilterOpen(true)
                            }}
                        >
                            <Icons name='search' size={28} color={'#4F4F4F'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: moderateScale(5), marginTop: moderateScaleVertical(15) }}>
                    <TouchableOpacity onPress={() => setFilterOpen(true)}>
                        <Image source={imagePath.filter} tintColor={'#333'} resizeMode='contain' style={{ height: moderateScale(25), width: moderateScale(23) }} />
                    </TouchableOpacity>
                    <View>
                        <FlatList
                            data={category}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => handleCategory(item.id)}
                                        key={index} style={{ backgroundColor: item.id === Gcategory ? '#F2F2F2' : '#fff', padding: moderateScale(8), borderRadius: scale(50), elevation: 3, marginHorizontal: scale(7), marginVertical: moderateScaleVertical(5) }}>
                                        <Text style={[styles.catstyle, { color: item.id === Gcategory ? 'black' : '#828282', fontWeight: item.id === Gcategory ? '800' : '500' }]}>{item.cat}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                {/* {
                    LoadEvents ? <Loader /> : */}
                <FlatList
                    data={EventsList}
                    ListEmptyComponent={<View style={{ height: height, width: width, flex: 1, justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontSize: scale(15), color: '#4F4F4F', fontWeight: '700', marginBottom: moderateScaleVertical(200) }}>There is no event happening in your area.</Text></View>}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={hasMore ? <LoaderList /> : null}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing} onRefresh={handleRefresh}
                            colors={['#005BD4', '#9Bd35A',]}
                            title={refreshing ? 'Updating...' : 'Pull down to refresh'}
                            // title='Updating'
                            titleColor={'green'}

                        />
                    }
                    renderItem={({ item, index }) => {
                        // console.log(item, 'event')
                        const UserLocation = CurrentUserLocation;
                        const Eventlocation = item.location;
                        const Distance = calculateDistance(UserLocation.latitude, UserLocation.longitude, Eventlocation.latitude, Eventlocation.longitude)
                        const date = item.dateOfEvent.split('T')
                        return (
                            <>
                                <HomeEvent User={User} item={item} key={index} Distance={isNaN(Distance) ? 0 : Distance} date={date} UserLocation={UserLocation} Eventlocation={Eventlocation} handleRefresh={handleRefresh} />
                            </>
                        )
                    }
                    }
                />
            </View>
            <View>
                <Modal
                    swipeDirection={'down'}
                    onSwipeComplete={() => setFilterOpen(false)}
                    hasBackdrop={true}
                    coverScreen={true}
                    backdropColor="#000"
                    backdropOpacity={0.8}
                    isVisible={FilterOpen}
                    style={{ justifyContent: 'flex-end', margin: 0, }}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={1000}
                    animationOutTiming={900}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                >
                    <SafeAreaView style={styles.locationmodalStyle}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: moderateScale(12) }}>
                            <TouchableOpacity onPress={() => setFilterOpen(false)}>
                                <IconsettingClose name='close-thick' size={25} color='#000' />
                            </TouchableOpacity>
                            <Text style={[styles.charlie, { marginLeft: moderateScale(20) }]}>Narrow your Search</Text>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(5) }} />
                            <View style={{ padding: moderateScale(12) }}>
                                <Text style={[styles.address, { fontSize: moderateScale(15) }]}>Who you want to search</Text>
                            </View>
                            <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), margin: moderateScale(10), elevation: 2, padding: moderateScale(15) }}>
                                <View style={{ marginVertical: moderateScaleVertical(10) }}>
                                    <Text style={[styles.alleventtxt, { marginBottom: moderateScale(5) }]}> (Enter event name...) :</Text>
                                    <TextInputC
                                        // ref={searchRef}
                                        // autoFocus={true}
                                        value={categoryName}
                                        editable={true}
                                        placeholder={'Search'}
                                        onChangeText={(text) => {
                                            setCategoryName(text)
                                        }}
                                    />
                                </View>
                                <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(8) }} />
                                <View style={{ marginBottom: moderateScaleVertical(10) }}>
                                    <Text style={[styles.alleventtxt, { marginBottom: moderateScale(5) }]}>Event Type :</Text>
                                    {/* <RadioForm
                                        labelStyle={{ marginRight: moderateScale(38), color: '#828282' }}
                                        formHorizontal={true}
                                        labelHorizontal={true}
                                        radio_props={radioButtons}
                                        initial={value}
                                        buttonColor={'#828282'}
                                        animation={true}
                                        onPress={(label) => {
                                            if (label === 'Other') {
                                                handleSelect(label)
                                            } else {
                                                handleSelect(label)
                                            }
                                        }}
                                        labelcolor='#828282'
                                        buttonSize={12}
                                    /> */}


                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {radioButtons.map((item, index) => {
                                            return (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                                    <TouchableOpacity style={{ marginRight: 5 }} onPress={() => {
                                                        if (item.label === 'Other') {
                                                            handleSelect(item.label)
                                                        } else {
                                                            handleSelect(item.label)
                                                        }
                                                    }}>
                                                        <Image style={{ height: 24, width: 24, resizeMode: 'contain', tintColor: '#828282' }} source={item.value == selected ? imagePath.radio_select : imagePath.radio_unselect} />
                                                    </TouchableOpacity>
                                                    <Text style={{ color: '#4F4F4F', fontWeight: '500' }} >{item.value}</Text>
                                                </View>
                                            )
                                        })
                                        }
                                    </View>
                                </View>
                                {/* <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(8) }} /> */}
                                {/* <View style={{ marginBottom: moderateScaleVertical(10) }}>
                                    <Text style={[styles.alleventtxt, { marginBottom: moderateScale(5) }]}>Distance Range :</Text>
                                    <Text style={[styles.alleventtxt, { textAlign: 'center' }]}>{Range}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={[styles.address, { fontSize: textScale(16), }]}>0</Text>
                                        <Slider
                                            style={{ flex: 1, }}

                                            minimumValue={0}
                                            maximumValue={20}
                                            minimumTrackTintColor={'#005BD4'}
                                            maximumTrackTintColor={'#BDBDBD'}
                                            thumbTintColor={'#005BD4'}
                                            step={1}
                                            onValueChange={(value) => setRange(value)}
                                        />
                                        <Text style={[styles.address, { fontSize: textScale(16) }]}>20</Text>
                                    </View>
                                </View> */}
                                {/* <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(8) }} />
                                <View style={{ marginVertical: moderateScaleVertical(10) }}>
                                    <Text style={[styles.alleventtxt, { marginBottom: moderateScale(5) }]}>Number of Participants :</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ width: '45%' }}>
                                            <Text style={[styles.address, { marginBottom: moderateScale(3), fontSize: textScale(15) }]}>From</Text>
                                            <TextInputC placeholder={'Enter'} />
                                        </View>
                                        <View style={{ width: '45%' }}>
                                            <Text style={[styles.address, { marginBottom: moderateScale(3), fontSize: textScale(15) }]}>To</Text>
                                            <TextInputC placeholder={'Enter'} />
                                        </View>
                                    </View>

                                </View>
                                <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(8) }} />
                                <View style={{ marginVertical: moderateScaleVertical(10) }}>
                                    <Text style={[styles.alleventtxt, { marginBottom: moderateScale(5) }]}>Order by (insert date, event date, distance, missing participants) :</Text>
                                    <TextInputC placeholder={'Enter'} />
                                </View>
                                <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(8) }} />
                                <View style={{ marginVertical: moderateScaleVertical(10) }}>
                                    <Text style={[styles.alleventtxt, { marginBottom: moderateScale(5) }]}>Time of day (morning, afternoon, evening, night) :</Text>
                                    <TextInputC placeholder={'Enter'} />
                                </View>
                                <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(8) }} /> */}

                                {/* <View style={{ marginBottom: moderateScaleVertical(10) }}>
                                    <Text style={[styles.alleventtxt, { marginBottom: moderateScale(5) }]}>Age Range :</Text>
                                    <Text style={[styles.alleventtxt, { textAlign: 'center' }]}>{Range}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={[styles.address, { fontSize: textScale(16), }]}>18</Text>
                                        <Slider
                                            style={{ flex: 1, }}
                                            minimumValue={18}
                                            maximumValue={60}
                                            minimumTrackTintColor={'#005BD4'}
                                            maximumTrackTintColor={'#BDBDBD'}
                                            thumbTintColor={'#005BD4'}
                                            step={1}
                                            onValueChange={(value) => setRange(value)}
                                        />
                                        <Text style={[styles.address, { fontSize: textScale(16) }]}>60</Text>
                                    </View>
                                </View> */}
                                <ButtonComp
                                    onPress={() => {
                                        getEventList(1)
                                        setFilterOpen(false)
                                    }}
                                    text='Submit' style={{ backgroundColor: '#005BD4' }} textStyle={{ textAlign: 'center' }} />
                            </View>
                        </ScrollView>

                    </SafeAreaView>
                </Modal>
            </View>
            <View>
                <Modal
                    // swipeDirection={'down'}
                    // onSwipeco={() => setLocationModal(false)}
                    hasBackdrop={true}
                    coverScreen={true}
                    backdropColor="#000"
                    backdropOpacity={0.8}
                    // onBackdropPress={() => setLocationModal(false)}
                    isVisible={openLocationModal}
                    style={{ justifyContent: 'flex-end', margin: 0, }}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={1000}
                    animationOutTiming={900}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                >
                    <SafeAreaView style={styles.locationmodalStyle}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                            <TouchableOpacity onPress={() => setLocationModal(false)}>
                                <IconsLike name='down' size={26} color='#333' style={{ marginLeft: moderateScale(5) }} />
                            </TouchableOpacity>
                            <Text style={styles.charlie}>Select Location</Text>
                        </View>
                        <View style={{ borderWidth: 0.5, borderColor: '#fff', }} />
                        <View style={{ marginTop: moderateScaleVertical(10), paddingHorizontal: moderateScale(12) }}>
                            <SearchPlaces onSearchPlaces={onSearchhandle} placeholder='Select new location' />
                        </View>
                        <View style={{ marginTop: moderateScale(10), backgroundColor: '#fff', marginHorizontal: moderateScale(15), padding: moderateScale(10), borderRadius: moderateScale(10) }}>
                            <Text style={[styles.alleventtxt, { fontSize: textScale(18) }]}>{'Current Location:'}</Text>
                            <Text style={[styles.address, { marginVertical: moderateScaleVertical(5), fontSize: textScale(14) }]}>{address}</Text>
                            <View style={{ height: moderateScaleVertical(280), width: '100%', marginTop: moderateScaleVertical(30), borderRadius: moderateScale(20) }}>
                                <MapView
                                    style={{
                                        height: moderateScaleVertical(280), flex: 1, width: '100%',
                                        borderRadius: moderateScale(10)
                                    }}
                                    provider={PROVIDER_GOOGLE}
                                    followsUserLocation={true}
                                    loadingEnabled={true}
                                    loadingIndicatorColor='#005BD4'
                                    moveOnMarkerPress={true}
                                    showsUserLocation={true}
                                    zoomEnabled={true}
                                    zoomControlEnabled={true}
                                    initialRegion={{
                                        latitude: latitude != null ? latitude : CurrentLocation.latitude,
                                        longitude: longitude != null ? longitude : CurrentLocation.longitude,
                                        latitudeDelta: 1,
                                        longitudeDelta: 1,
                                    }}>
                                    <Marker
                                        tappable={true}
                                        pinColor='red'
                                        coordinate={{
                                            latitude: latitude != null ? latitude : CurrentLocation.latitude,
                                            longitude: longitude != null ? longitude : CurrentLocation.longitude,
                                        }}
                                        title="Your are Here!"
                                    />
                                </MapView>
                            </View>
                            <ButtonComp onPress={() => setLocationModal(false)} isLoading={Loading} style={{ backgroundColor: '#005BD4', marginTop: moderateScaleVertical(10) }} text='Use my position' />
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>

        </WrapperContainer>

    );
};

//

// define your styles
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: '#fff',
        // // marginHorizontal:moderateScale(3),
        // // paddingHorizontal: moderateScale(12),
        // elevation: 3,
        // marginVertical: moderateScaleVertical(10),
        // borderRadius: moderateScale(5)
    },
    hometxt: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(20),
        fontWeight: '700'
    },
    address: {
        color: '#4F4F4F',
        fontFamily: 'Roboto',
        fontSize: scale(12),
        fontWeight: '400'
    },
    alleventtxt: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(14),
        fontWeight: '800'
    },
    seeall: {
        color: '#005BD4',
        fontFamily: 'Roboto',
        fontSize: scale(14),
        fontWeight: '800'
    },
    charlie: {
        color: '#333',
        fontSize: scale(20),
        fontFamily: 'Roboto',
        fontWeight: '700',
        marginLeft: moderateScale(10)
    },
    eventtxt: {
        color: '#4F4F4F',
        fontSize: scale(14),
        fontWeight: '500'
    },
    modalStyle: {
        // flex:1,
        backgroundColor: '#F2F2F2',
        minHeight: moderateScale(height / 3),
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        padding: moderateScale(12),
    },
    locationmodalStyle: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        minHeight: moderateScale(height / 3),
    },
    txt: {
        color: '#4F4F4F',
        fontFamily: 'Poppins',
        fontSize: scale(15),
        fontWeight: '600'
    },
    catstyle: {
        color: '#828282',
        fontFamily: 'Roboto',
        fontSize: scale(12),
        fontWeight: '900'
    },
    modalStyleFilter: {
        // position:'absolute',
        backgroundColor: '#FFF',
        minHeight: moderateScale(height / 6),
        borderRadius: moderateScale(15),
        width: moderateScale(width / 2),
        // borderTopLeftRadius: moderateScale(20),
        // borderTopRightRadius: moderateScale(20),
        // flex: 1,
        // flexDirection: 'column',
        justifyContent: 'space-between',
        padding: moderateScale(16)
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
export default Home;

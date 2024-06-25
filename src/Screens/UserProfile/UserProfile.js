//import liraries
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, ActivityIndicator, FlatList, Dimensions, PermissionsAndroid } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';

import { moderateScale, moderateScaleVertical, scale, height, width, textScale } from '../../styles/responsiveSize';
import HeaderBack from '../../Components/HeaderBack';
import { useSelector } from 'react-redux';
import imagePath from '../../constants/imagePath';
import navigationStrings from '../../Navigation/navigationStrings';
import Modal from 'react-native-modal'
import Iconsetting from 'react-native-vector-icons/MaterialIcons'
import Reputation from '../../Components/Reputation';
import Iconpaid from 'react-native-vector-icons/MaterialIcons'
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Loader from '../../Components/Loader';
import axios from 'axios';
import { getData } from '../../utils/helperFunctions';
import IconsettingClose from 'react-native-vector-icons/MaterialCommunityIcons'
import ButtonComp from '../../Components/ButtonComp';
import Snackbar from 'react-native-snackbar';
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';


const category = [{
    id: 1,
    cat: 'All Event’s'
},
{
    id: 2,
    cat: 'Past Events'
},
{
    id: 3,
    cat: 'Upcoming Events'
},
]


// create a component
const UserProfile = ({ navigation }) => {
    const isFocused = useIsFocused();
    const scrollViewRef = useRef();
    const [Gcategory, setGcategory] = useState(1)
    const [menuOpen, setmenuOpen] = useState(false);
    const [followerModal, setfollowerModal] = useState(false);
    const [followlistModal, setfollowlistModal] = useState(false)
    const [openoptionModal3, setoptionopenModal3] = useState();
    const [followersList, setfollowersList] = useState([]);
    const [followingList, setfollowingList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setoffset] = useState(null)
    const [followpage, setFollowPage] = useState(1);
    const [followingpage, setFollowingPage] = useState(1);
    const [hasfollowingMore, setHasFollowingMore] = useState(true);
    const [hasfollowersMore, setHasFollowersMore] = useState(true);
    const [selectImageModal, setselectImageModal] = useState(false);
    const [profilePic, setprofilePic] = useState(null)
    const [imgSelected, setimgSelected] = useState(null)
    const [attendence, setAttendence] = useState([])
    const [reviewDetail, setReviewDetail] = useState([])
    const [user, setUser] = useState({})
    const UserKYCstatus = user?.kyc?.isVerified;
    let DOB = user?.dateOfBirth?.split('T');
    const age = DOB != undefined && calculateAge(DOB[0]);

    function calculateAge(dateOfBirth) {
        // Convert dateOfBirth string to a Date object
        const dob = new Date(dateOfBirth);

        // Get the current date
        const currentDate = new Date();

        // Calculate the difference in years
        let age = currentDate.getFullYear() - dob.getFullYear();

        // Check if the birthday has occurred this year
        if (
            currentDate.getMonth() < dob.getMonth() ||
            (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())
        ) {
            age--;
        }

        return age;
    }


    useEffect(() => {
        getProfile()
        getFollowerList(1)
        getFollowingList(1)

    }, [])


    const handleOnScroll = event => {
        setoffset(event.nativeEvent.contentOffset.y)
    };

    const handleScrollTo = p => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo(p);
        }
    };


    const getFollowerList = async (pageNumber) => {
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
            const response = await axios.get(`https://plansaround-backend.vercel.app/api/mobile/profile/followers?page=${pageNumber}&limit=10`, { headers });
            const responseData = response.data;
            console.log(responseData, 'followers')
            const followerList = responseData?.followers;
            setfollowersList((prevEvents) => {
                if (pageNumber === 1) {
                    // If it's the first page, replace existing events
                    return followerList;
                } else {
                    // If it's not the first page, append new events to the existing list
                    return [...prevEvents, ...followerList];
                }
            });
            setFollowPage(pageNumber);
            setHasFollowersMore(followerList?.length > 0);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };


    const getFollowingList = async (pageNumber) => {
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
            const response = await axios.get(`https://plansaround-backend.vercel.app/api/mobile/profile/following?page=${pageNumber}&limit=10`, { headers });
            const responseData = response.data;
            console.log(responseData, 'following')
            const followingsList = responseData?.following;
            // setfollowingList(packageList)
            setfollowingList((prevEvents) => {
                if (pageNumber === 1) {
                    // If it's the first page, replace existing events
                    return followingsList;
                } else {
                    // If it's not the first page, append new events to the existing list
                    return [...prevEvents, ...followingsList];
                }
            });
            setFollowingPage(pageNumber)
            setHasFollowingMore(followingsList?.length > 0);
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const getProfile = async () => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        try {
            let usertoken = await getData('UserToken');
            console.log('userTokenProfile', usertoken)
            const headers = {
                'Authorization': `Bearer ${usertoken}`,
                'Content-Type': "application/json",
            };
            const response = await axios.get(`https://plansaround-backend.vercel.app/api/mobile/profile`, { headers });
            const responseData = response.data;
            console.log(JSON.stringify(responseData), 'profiledata')
            const userData = responseData?.user;
            setUser(userData)
            const attendance = responseData?.user?.eventAttendance;
            setAttendence(attendance)
            const reviewList = responseData?.user?.userReviews;
            setReviewDetail(reviewList)
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };


    const handleFollowersLoadMore = () => {
        if (!isLoading && hasfollowersMore) {
            getFollowerList(followpage + 1);
        }
    };

    const handleFollowingLoadMore = () => {
        if (!isLoading && hasfollowingMore) {
            getFollowingList(followingpage + 1);
        }
    };

    const handleUnfollow = async (id) => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        try {
            let usertoken = await getData('UserToken');
            console.log('userTokenProfile', usertoken)
            const headers = {
                'Authorization': `Bearer ${usertoken}`,
                'Content-Type': "application/json",
            };
            const formData = new FormData();
            formData.append("id", id);
            const response = await axios.post(`https://plansaround-backend.vercel.app/api/mobile/homepage/users/remove-following`, { "id": id }, { headers });
            const responseData = response.data;
            console.log(responseData, 'unfollowrequest');
            getProfile()
            getFollowingList(1)
            Snackbar.show({
                text: `${response?.data?.message}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#005BD4',
                textColor: "#fff",
            });
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            Snackbar.show({
                text: `${error?.response?.data?.message}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
            console.log(error);
        }
    }

    const handleFollow = async (id) => {
        let usertoken = await getData('UserToken');
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        const formData = new FormData();
        formData.append('id', id);
        axios.post('https://plansaround-backend.vercel.app/api/mobile/homepage/users/follow-request', { "id": id }, { headers })
            .then((res) => {
                console.log(res, 'Followrequest');
                getProfile()
                getFollowingList(1)
                Snackbar.show({
                    text: `${res?.data?.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });
            })
            .catch((error) => {
                console.log(error?.response?.data?.message);
                Snackbar.show({
                    text: `${error?.response?.data?.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    textColor: "#fff",
                });
            });
    }


    const LoaderList = () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#005BD4" />
            <Text style={[styles.eventtxt, { color: '#005BD4' }]}>Loading</Text>
        </View>
    );




    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };


    const captureImage = async (type, id) => {
        let options = {
            maxWidth: 300,
            maxHeight: 550,
            mediaType: 'photo',
            includeBase64: false,
            quality: 0.5,
            cameraType: 'back',
        };
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted) {
            launchCamera(options, (response) => {
                console.log('Response = ', response.assets);
                if (response.didCancel) {
                    alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    alert('Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }
                let img = response?.assets[0]?.uri
                setimgSelected(response?.assets);
                setselectImageModal(false)
                setprofilePic(img)
                handleprofSubmit(response?.assets)
            });


        }
    };

    const chooseFile = (type, id) => {
        let options = {
            maxWidth: 300,
            maxHeight: 550,
            mediaType: 'photo',
            includeBase64: false,
            quality: 0.5,
        };
        launchImageLibrary(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            let img = response?.assets[0]?.uri
            setimgSelected(response?.assets);
            setselectImageModal(false)
            setprofilePic(img)
            handleprofSubmit(response?.assets)
        });
    };

    const handleprofSubmit = async (img) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("image", {
            uri: img[0]?.uri,
            type: img[0]?.type, // Modify the type based on your image type
            name: img[0]?.fileName,
            fileName: img[0]?.fileName,
        });
        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': 'multipart/form-data',
        };

        axios.post('https://plansaround-backend.vercel.app/api/mobile/profile/change-profile-picture', formData, { headers })
            .then((res) => {
                console.log('uwwhwhwhrurh', res.data);
                setIsLoading(false);
                Snackbar.show({
                    text: `${res.data.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });


            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
                Snackbar.show({
                    text: `${error?.response?.data?.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    textColor: "#fff",
                });
            });
    }


    console.log('user', user)
    return (
        <WrapperContainer>
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <HeaderBack onRightIconClick={() => navigation.navigate(navigationStrings.SETTINGS)} rightIcon={true} isLeftImage={false} onRightImgClick={() => setoptionopenModal3(!openoptionModal3)} rightImage={imagePath.sq} rightImg={true} mainText={user?.fullName} maintxtstyle={{ color: '#333', fontFamily: 'Roboto', fontSize: scale(22) }} style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(16) }} />
            {isLoading ? <LoaderList /> :
                <ScrollView>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', }}>
                            <TouchableOpacity style={{ width: '35%' }} onPress={() => {
                                setselectImageModal(true)
                            }}>
                                {user?.profilePicture ? <Image source={{ uri: user?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(100), width: moderateScale(100), borderRadius: moderateScale(55), resizeMode: 'cover' }} /> :

                                    <Image source={profilePic
                                        ? {
                                            uri: profilePic,
                                        }
                                        : imagePath.Gola} style={{ height: moderateScale(100), width: moderateScale(100), borderRadius: moderateScale(55), resizeMode: 'cover' }} />}
                                <Image source={imagePath.plus} style={{ alignSelf: 'center', height: scale(30), width: scale(30), position: 'absolute', bottom: 10, left: moderateScale(78) }} />
                            </TouchableOpacity>
                            <View style={{ width: '65%', flexDirection: 'row', justifyContent: 'space-between', }}>
                                <View>
                                    <Text style={[styles.hometxt, { textAlign: 'center', fontSize: textScale(20) }]}>{user?.eventsCount}</Text>
                                    <Text style={[styles.textone, { fontWeight: '500', fontSize: textScale(18) }]}>Events</Text>
                                </View>
                                <TouchableOpacity onPress={() => { setfollowerModal(true), getFollowerList(1) }}>
                                    <Text style={[styles.hometxt, { textAlign: 'center', fontSize: textScale(20) }]}>{user?.followersCount}</Text>
                                    <Text style={[styles.textone, { fontWeight: '500', fontSize: textScale(18) }]}>Followers</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setfollowlistModal(true), getFollowingList(1) }}>
                                    <Text style={[styles.hometxt, { textAlign: 'center', fontSize: textScale(20) }]}>{user?.followingCount}</Text>
                                    <Text style={[styles.textone, { fontWeight: '500', fontSize: textScale(18) }]}>Following</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(navigationStrings.ALLPLANS)
                            }}
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: moderateScaleVertical(5), marginLeft: moderateScale(3) }}>
                            <Text style={{ textAlign: 'center', color: '#333', fontFamily: 'Roboto', fontSize: scale(15), fontWeight: '700' }}>{user.fullName ? user.fullName : 'NA'}</Text>
                            <Iconpaid name='verified' size={18} color='#005BD4' style={{ marginLeft: moderateScale(3) }} />
                        </TouchableOpacity>

                        <View style={{ padding: moderateScaleVertical(15), backgroundColor: '#fff', borderRadius: moderateScale(8), marginVertical: moderateScaleVertical(15) }}>
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                            <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Date of Birth</Text>
                            <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{DOB[0]}</Text>
                        </View> */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Age</Text>
                                <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{age ? age : 'NA'} yrs.</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Gender</Text>
                                <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{user?.gender?.name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>University</Text>
                                <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{user?.study?.university ? user?.study?.university : 'NA'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Degree</Text>
                                <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{user?.study?.degree ? user?.study?.degree : 'NA'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Work</Text>
                                <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{user?.profession?.name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Political Belief</Text>
                                <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{user?.politicalBelief?.name ? user?.politicalBelief?.name : 'NA'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Religious Belief</Text>
                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'right', fontWeight: '500' }]}>{user?.religiousBelief?.name ? user?.religiousBelief?.name : 'NA'}</Text>
                            </View>
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                            <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>KYC</Text>
                            <Text style={[styles.txt, { flex: 0.5, textAlign: 'right', fontWeight: '500' }]}>{'Not verified'}</Text>
                        </View> */}
                        </View>

                        <View style={{ padding: moderateScaleVertical(15), backgroundColor: '#fff', borderRadius: moderateScale(8), }}>
                            <Text style={[styles.txt, { textAlign: 'left', fontWeight: 'bold' }]}>Bio</Text>
                            <Text style={[styles.txt, { textAlign: 'left', fontWeight: '500' }]}>{user?.bio ? user?.bio?.description : 'NA'}</Text>
                        </View>

                        {/* <View style={{ padding: moderateScaleVertical(15), backgroundColor: '#fff', borderRadius: moderateScale(8), marginVertical: moderateScaleVertical(15) }}>
                        <Text style={[styles.txt, { textAlign: 'left', fontWeight: 'bold' }]}>Interests</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {
                                user?.interests.map((item, index) => {
                                    return (
                                        <View key={index} style={{ marginHorizontal: moderateScale(2), marginVertical: moderateScaleVertical(5), flexDirection: 'row' }}>
                                            <View style={styles.Interestscontainer}>
                                                <Text style={[styles.txt, {
                                                    color: '#4F4F4F', fontWeight: '500', fontSize: textScale(16), paddingHorizontal: moderateScale(5)
                                                }]}>
                                                {item}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View> */}

                        <View>
                            <Reputation attendence={attendence} reviewDetail={reviewDetail} />
                        </View>
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: moderateScale(5), marginVertical: moderateScaleVertical(10) }}>
                        <Image source={imagePath.filter} tintColor={'#333'} resizeMode='contain' style={{ height: moderateScale(20), width: moderateScale(20) }} />
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
                    </View> */}
                        {/* <View
                        style={{
                            borderRadius: moderateScale(10),
                            paddingVertical: moderateScaleVertical(10), backgroundColor: '#fff', paddingHorizontal: moderateScale(10)
                        }} > */}

                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10), justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={imagePath.frame2} />
                                <Text style={[styles.textone, { marginLeft: moderateScale(10) }]}>Charlie Harper</Text>
                            </View>
                        </View> */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500', marginVertical: moderateScaleVertical(5) }]}>Date</Text>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700' }]}>02 March 2023</Text>
                        </View> */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500' }]}>Event</Text>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700' }]}>Badminton</Text>
                        </View> */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500', marginVertical: moderateScaleVertical(5) }]}>No. of people attended</Text>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700' }]}>4</Text>
                        </View> */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500' }]}>Location</Text>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700', paddingBottom: moderateScaleVertical(10) }]}>946 Brook Ranch, Italy</Text>
                        </View> */}
                        {/* </View> */}
                        {/* <View style={{
                            borderRadius: moderateScale(10), marginVertical: moderateScaleVertical(10),
                            paddingVertical: moderateScaleVertical(10), backgroundColor: '#fff', paddingHorizontal: moderateScale(10)
                        }} > */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10), justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={imagePath.frame2} />
                                <Text style={[styles.textone, { marginLeft: moderateScale(10) }]}>Charlie Harper</Text>
                            </View>
                        </View> */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500', marginVertical: moderateScaleVertical(5) }]}>Date</Text>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700' }]}>02 March 2023</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500' }]}>Event</Text>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700' }]}>Badminton</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500', marginVertical: moderateScaleVertical(5) }]}>No. of people attended</Text>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700' }]}>4</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500' }]}>Location</Text>
                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '700', paddingBottom: moderateScaleVertical(10) }]}>946 Brook Ranch, Italy</Text>
                        </View> */}
                        {/* </View> */}
                    </View>
                </ScrollView>
            }
            <Modal
                style={{ position: 'absolute', right: 0, top: moderateScaleVertical(25) }}
                isVisible={menuOpen}
                onBackdropPress={() => setmenuOpen(false)}
                animationIn="zoomInDown"
                animationOut="zoomOutDown"
                animationInTiming={800}
                animationOutTiming={1000}
                backdropTransitionInTiming={800}
                backdropTransitionOutTiming={800}
            >
                <View style={[styles.modalStyle, {}]}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(2) }}>
                        <Iconsetting name='supervised-user-circle' size={25} color='#4F4F4F' />
                        <Text style={{ color: '#4F4F4F', fontSize: scale(15), fontWeight: '600', lineHeight: scale(20), marginLeft: moderateScale(5) }}>Followers </Text>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 0.5, borderColor: '#C0C0C0', marginVertical: moderateScaleVertical(2) }} />
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(2) }}>
                        <Iconsetting name='verified-user' size={25} color='#4F4F4F' />
                        <Text style={{ color: '#4F4F4F', fontSize: scale(15), fontWeight: '600', lineHeight: scale(20), marginLeft: moderateScale(5) }}>Following </Text>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 0.5, borderColor: '#C0C0C0', marginVertical: moderateScaleVertical(2) }} />
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(2) }}>
                        <Iconsetting name='manage-accounts' size={25} color='#4F4F4F' />
                        <Text style={{ color: '#4F4F4F', fontSize: scale(15), fontWeight: '600', lineHeight: scale(20), marginLeft: moderateScale(5) }}>Account </Text>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 0.5, borderColor: '#C0C0C0', marginVertical: moderateScaleVertical(2) }} />
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(2) }} >
                        <Iconsetting name='verified' size={20} color='#4F4F4F' />
                        <Text style={{ color: '#4F4F4F', fontSize: scale(15), fontWeight: '600', lineHeight: scale(20), marginLeft: moderateScale(9) }}>KYC Verification</Text>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 0.5, borderColor: '#C0C0C0', marginVertical: moderateScaleVertical(2) }} />
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(2) }} >
                        <Iconsetting name='help' size={20} color='#4F4F4F' />
                        <Text style={{ color: '#4F4F4F', fontSize: scale(15), fontWeight: '600', lineHeight: scale(20), marginLeft: moderateScale(9), }}>Help & Support</Text>
                    </TouchableOpacity>
                    <View style={{ borderWidth: 0.5, borderColor: '#C0C0C0', marginVertical: moderateScaleVertical(2) }} />
                </View>
            </Modal>
            <Modal
                coverScreen={true}
                isVisible={openoptionModal3}
                backdropColor="rgba(255,255, 255, 0.8)"
                backdropOpacity={UserKYCstatus ? 0.9 : 1}
                onBackdropPress={() => setoptionopenModal3(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={900}
                animationOutTiming={800}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
                style={{ justifyContent: 'flex-end', margin: 0 }}
            >
                <View style={styles.modalStyle3}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.hometxt}>Choose Event Type</Text>
                        </View>
                        <TouchableOpacity onPress={() => setoptionopenModal3(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: '#ffff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(10) }}>
                        <TouchableOpacity disabled={UserKYCstatus ? false : true}
                            onPress={() => {
                                setoptionopenModal3(false)
                                user?.packageValidTill !== null ? navigation.navigate(navigationStrings.HOST_EVENT, { isPaid: true, modal: false, EventType: 'PAID' }) : navigation.navigate(navigationStrings.ALLPLANS)
                            }}
                            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Text style={styles.txt}>Paid Event</Text>
                            <Iconpaid name='paid' size={30} color={'#005BD4'} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: '#ffff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(5) }}>
                        <TouchableOpacity disabled={UserKYCstatus ? false : true} onPress={() => {
                            setoptionopenModal3(false)
                            navigation.navigate(navigationStrings.HOST_EVENT, { data: true, EventType: 'FREE' })
                        }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Text style={styles.txt}>Free Event</Text>
                            <Iconpaid name='try' size={30} color={'#005BD4'} />
                        </TouchableOpacity>
                    </View>
                    {
                        UserKYCstatus ? <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: moderateScaleVertical(10) }}>
                            <Image source={imagePath.kycN} resizeMode='contain' style={{ height: moderateScaleVertical(30), width: moderateScale(30), }} />
                            <Text style={[styles.phoneHeading, { fontSize: moderateScale(15), color: 'green', marginLeft: moderateScale(10), fontFamily: 'Roboto' }]}>KYC VERIFIED</Text>
                        </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => {
                                setoptionopenModal3(false)
                                navigation.navigate(navigationStrings.REKYC)
                            }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: moderateScaleVertical(10) }}>
                                <Image source={imagePath.kycN} resizeMode='contain' style={{ height: moderateScaleVertical(30), width: moderateScale(30), }} />
                                <Text style={[styles.phoneHeading, { fontSize: moderateScale(15), color: 'red', marginLeft: moderateScale(10), fontFamily: 'Roboto' }]}>KYC REQUIRED</Text>
                            </TouchableOpacity>
                    }
                </View>
            </Modal>
            <Modal
                hasBackdrop={true}
                coverScreen={true}
                backdropColor="#000"
                backdropOpacity={0.8}
                isVisible={followerModal}
                style={{ justifyContent: 'flex-end', margin: 0 }}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={1000}
                animationOutTiming={900}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600} >
                <SafeAreaView style={styles.locationmodalStyle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: moderateScale(12) }}>
                        <TouchableOpacity onPress={() => setfollowerModal(false)}>
                            <IconsettingClose name='close-thick' size={25} color='#000' />
                        </TouchableOpacity>
                        <Text style={[styles.charlie, { marginLeft: moderateScale(20), fontSize: textScale(18), fontFamily: 'Roboto', fontWeight: '800', }]}>Followers</Text>
                    </View>
                    <FlatList
                        data={followersList}
                        ListEmptyComponent={<View style={{ justifyContent: 'center', alignContent: 'center', height: Dimensions.get('screen').height / 2 }}>
                            {isLoading ? <LoaderList /> : <Text style={[styles.phoneHeading, { fontSize: textScale(18), textAlign: 'center' }]}>{'No Details'}</Text>}
                        </View>}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={handleFollowersLoadMore}
                        onEndReachedThreshold={0.1}
                        renderItem={({ item, index }) => {
                            console.log('item---', item)
                            return (
                                <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(20), }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {item?.profilePicture ? <Image source={{ uri: item?.profilePicture }} style={{ height: moderateScaleVertical(30), width: moderateScale(30), borderRadius: moderateScale(15), alignSelf: 'center', marginVertical: moderateScaleVertical(10) }} /> :
                                            <Image source={imagePath.Gola} style={{ height: moderateScale(30), width: moderateScale(30), borderRadius: moderateScale(15), alignSelf: 'center', marginVertical: moderateScaleVertical(10) }} />}
                                        <Text style={[styles.phoneHeading, { textAlign: 'center' }]}>{item?.fullName}</Text>
                                        <ButtonComp text={item?.userIsFollowing ? 'Following' : 'Follow'}
                                            style={{ backgroundColor: '#005BD4', width: '30%', height: moderateScale(35), marginLeft: moderateScale(30) }} onPress={() => {
                                                handleFollow(item?._id)
                                            }
                                            } />
                                    </View>
                                </View>
                            )
                        }
                        }
                    />
                </SafeAreaView>
            </Modal>
            <Modal
                hasBackdrop={true}
                coverScreen={true}
                backdropColor="#000"
                backdropOpacity={0.8}
                isVisible={followlistModal}
                style={{ justifyContent: 'flex-end', margin: 0 }}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={1000}
                animationOutTiming={900}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600} >
                <SafeAreaView style={styles.locationmodalStyle}>
                    <SafeAreaView style={styles.locationmodalStyle}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: moderateScale(12) }}>
                            <TouchableOpacity onPress={() => setfollowlistModal(false)}>
                                <IconsettingClose name='close-thick' size={25} color='#000' />
                            </TouchableOpacity>
                            <Text style={[styles.charlie, {
                                marginLeft: moderateScale(20), fontSize: textScale(18), fontFamily: 'Roboto',
                                fontWeight: '800',
                            }]}>Following</Text>
                        </View>
                        <FlatList
                            data={followingList}
                            ListEmptyComponent={<View style={{ justifyContent: 'center', alignContent: 'center', height: Dimensions.get('screen').height / 2 }}>
                                {isLoading ? <LoaderList /> : <Text style={[styles.phoneHeading, { fontSize: textScale(18), textAlign: 'center' }]}>{'No Details'}</Text>}
                            </View>}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={handleFollowingLoadMore}
                            onEndReachedThreshold={0.1}
                            renderItem={({ item, index }) => {
                                console.log('item---', item)
                                return (
                                    <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(20), flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {item?.profilePicture ? <Image source={{ uri: item?.profilePicture }} style={{ height: moderateScaleVertical(30), width: moderateScale(30), borderRadius: moderateScale(15), alignSelf: 'center', marginVertical: moderateScaleVertical(10) }} /> :
                                                <Image source={imagePath.Gola} style={{ height: moderateScale(30), width: moderateScale(30), borderRadius: moderateScale(15), alignSelf: 'center', marginVertical: moderateScaleVertical(10) }} />}
                                            <Text style={[styles.phoneHeading, { textAlign: 'center' }]}>{item?.fullName}</Text>
                                            <ButtonComp text={'Unfollow'}
                                                style={{ backgroundColor: '#005BD4', width: '30%', height: moderateScale(35), marginLeft: moderateScale(30) }} onPress={() => {
                                                    handleUnfollow(item?._id)
                                                }
                                                } />
                                        </View>
                                    </View>
                                )

                            }
                            }
                        />
                    </SafeAreaView>
                </SafeAreaView>
            </Modal>
            <Modal
                hasBackdrop={true}
                coverScreen={true}
                backdropColor="#000"
                backdropOpacity={0.5}
                // onBackdropPress={() => setLocationModal(false)}
                isVisible={selectImageModal}
                style={{ justifyContent: 'flex-end', margin: 0 }}
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
                <View style={[styles.modalStyle2]}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.hometxt, { marginLeft: moderateScale(5), fontSize: moderateScale(18), fontWeight: '800', }]}>Select Images</Text>
                        </View>
                        <TouchableOpacity onPress={() => setselectImageModal(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, marginTop: moderateScale(30) }}>


                        <TouchableOpacity onPress={() => {
                            // setselectImageModal(false)
                            chooseFile('photo', 4)
                        }}
                            style={{ marginBottom: moderateScale(20), borderBottomColor: '#D3D3D3', borderBottomWidth: 1, paddingBottom: moderateScaleVertical(20) }}>

                            <Text style={[styles.charlie, {
                                fontSize: textScale(16),
                                fontFamily: 'Roboto',
                                fontWeight: '600', textTransform: 'capitalize'
                            }]}>Select from Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {

                            captureImage('photo', 3)
                        }}>

                            <Text style={[styles.charlie, {
                                fontSize: textScale(16), fontFamily: 'Roboto',
                                fontWeight: '600', textTransform: 'capitalize'
                            }]}>Capture Image</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(12),
        backgroundColor: '#F2F2F2',
    },
    modalStyle2: {
        // flex:1,
        backgroundColor: '#F2F2F2',
        minHeight: moderateScale(height / 4),
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
        fontFamily: 'Roboto',
        fontSize: scale(14),
        fontWeight: '600'
    },
    Interestscontainer: {
        backgroundColor: '#F2F2F2',
        flexDirection: 'row',
        padding: moderateScale(8),
        borderRadius: moderateScale(50)
    },
    txtheading: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(12),
        fontWeight: '700',
        marginLeft: moderateScale(5)
    },
    catstyle: {
        color: '#828282',
        fontFamily: 'Roboto',
        fontSize: scale(12),
        fontWeight: '900'
    },
    textone: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(20),
        fontWeight: '800'
    },
    modalStyle: {
        backgroundColor: '#FFF',
        minHeight: moderateScale(height / 6),
        borderRadius: moderateScale(15),
        width: moderateScale(width / 2),
        justifyContent: 'space-between',
        padding: moderateScale(16)
    },
    modalStyle3: {
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
    },
    phoneHeading: {
        fontSize: scale(14),
        fontFamily: 'Roboto',
        fontWeight: '600',
        color: '#333',
        marginLeft: scale(10)
    },


});

export default UserProfile;

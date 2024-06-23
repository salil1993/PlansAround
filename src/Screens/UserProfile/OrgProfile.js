//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, SafeAreaView, Dimensions, TouchableOpacity, Image, RefreshControl } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { height, moderateScale, moderateScaleVertical, scale, textScale } from '../../styles/responsiveSize';
import Loader from '../../Components/Loader';
import imagePath from '../../constants/imagePath';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import Iconpaid from 'react-native-vector-icons/MaterialIcons'
import Reputation from '../../Components/Reputation';
import Modal from 'react-native-modal'
import IconsettingClose from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment';
import ButtonComp from '../../Components/ButtonComp';
import Snackbar from 'react-native-snackbar';
// create a component
const OrgProfile = ({ navigation, route }) => {
    const Profile = route.params.Profile;
    const [LoadEvents, setLoadEvents] = useState(false);
    const [ProfileN, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [Gcategory, setGcategory] = useState(1)
    let DOB = ProfileN?.dateOfBirth?.split('T');
    const [followpage, setFollowPage] = useState(1);
    const [followingpage, setFollowingPage] = useState(1);
    const [eventPage, setEventPage] = useState(1);
    const [hasfollowingMore, setHasFollowingMore] = useState(true);
    const [hasfollowersMore, setHasFollowersMore] = useState(true);
    const [haseventMore, setHasEventMore] = useState(true);
    const [followersList, setfollowersList] = useState([]);
    const [followingList, setfollowingList] = useState([]);
    const [EventList, seteventList] = useState([]);
    const [followerModal, setfollowerModal] = useState(false);
    const [followlistModal, setfollowlistModal] = useState(false)
    const [attendence,setAttendence] = useState(null)
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


    //console.log('DOB--->>', DOB)
    const age = DOB != undefined && calculateAge(DOB[0]);
    useEffect(() => {
        getOrgProfile()
        getFollowerList(1)
        getFollowingList(1)
        getEventList(1, 'all')
    }, [])

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
   
    const handleCategory = (id) => {
        setGcategory(id)
    }

    const getOrgProfile = async () => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);

        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        let EndPoint = `https://plansaround-backend.vercel.app/api/mobile/homepage/events/organiser/${Profile}/detail`
        console.log('EndPoint', EndPoint)
        axios.get(EndPoint, { headers })
            .then((res) => {
                const responseData = res?.data;
                console.log(responseData, 'getOrgProfile')
                const newProfile = responseData?.user;
                console.log(newProfile, 'profileeeeee')
                setProfile(newProfile)
                setAttendence(responseData?.attendance)

                setIsLoading(false);
            }).
            catch((err) => {
                console.log(err)
                setIsLoading(false);
            })
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
            const response = await axios.get(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/organiser/${Profile}/followers?page=${pageNumber}&limit=10`, { headers });
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
            const response = await axios.get(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/organiser/${Profile}/following?page=${pageNumber}&limit=10`, { headers });
            const responseData = response.data;
            console.log(responseData, 'following')
            const followingsList = responseData?.following;
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


    const getEventList = async (pageNumber, status) => {
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
            const response = await axios.get(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/organiser/${Profile}/events?status=${status}&limit=5&page=${pageNumber}`, { headers });
            const responseData = response.data;
            console.log(JSON.stringify(responseData), 'eventList')
            const eventList = responseData?.events?.docs;
            seteventList((prevEvents) => {
                if (pageNumber === 1) {
                    // If it's the first page, replace existing events
                    return eventList;
                } else {
                    // If it's not the first page, append new events to the existing list
                    return [...prevEvents, ...eventList];
                }
            });
            setEventPage(pageNumber)
            setHasEventMore(eventList?.length > 0);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const handleEventLoadMore = () => {
        if (!isLoading && haseventMore) {
            getEventList(eventPage + 1, 'all');
        }
    };

    const handleFollow = async (id) => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        let usertoken = await getData('UserToken');
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        const formData = new FormData();
        formData.append('id', id);
        axios.post('https://plansaround-backend.vercel.app/api/mobile/homepage/users/follow-request', {"id":id}, { headers })
            .then((res) => {
                console.log(res, 'Followrequest');
                getOrgProfile()
                getFollowingList(1)
                Snackbar.show({
                    text: `${res?.data?.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error?.response?.data?.message);
                setIsLoading(false);
                Snackbar.show({
                    text: `${error?.response?.data?.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    textColor: "#fff",
                });
            });
    }

    const handleUnfollow = async(id) =>{
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
            formData.append('id', id);
            const response = await axios.post(`https://plansaround-backend.vercel.app/api/mobile/homepage/users/remove-following`,formData, { headers });
           // const responseData = response.data;
           getOrgProfile()
            console.log(response?.data?.message, 'unfollowrequest');
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



    return (
        <WrapperContainer>
            <HeaderBack mainText={ProfileN?.fullName ? ProfileN?.fullName : 'User'} style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    {ProfileN ? (
                        <FlatList
                            data={[ProfileN]} // Wrap ProfileN in an array
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                // console.log('item--->>', item)
                                return (
                                    <>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                            <TouchableOpacity style={{ width: '35%' }}>
                                                {item?.profilePicture ? (
                                                    <Image source={{ uri: item?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(100), width: moderateScale(100), borderRadius: moderateScale(50) }} />
                                                ) : (
                                                    <Image source={imagePath.Gola} resizeMode='contain' style={{ height: moderateScale(100), width: moderateScale(100), borderRadius: moderateScale(50) }} />
                                                )}
                                            </TouchableOpacity>
                                            <View style={{ width: '65%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View>
                                                    <Text style={[styles.hometxt, { textAlign: 'center', fontSize: textScale(20) }]}>{ProfileN?.eventCount ? ProfileN?.eventCount : 0}</Text>
                                                    <Text style={[styles.textone, { fontWeight: '500', fontSize: textScale(18) }]}>Events</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => setfollowerModal(true)}>
                                                    <Text style={[styles.hometxt, { textAlign: 'center', fontSize: textScale(20) }]}>{ProfileN?.followersCount}</Text>
                                                    <Text style={[styles.textone, { fontWeight: '500', fontSize: textScale(18) }]}>Followers</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => setfollowlistModal(true)}>
                                                    <Text style={[styles.hometxt, { textAlign: 'center', fontSize: textScale(20) }]}>{ProfileN?.followingCount}</Text>
                                                    <Text style={[styles.textone, { fontWeight: '500', fontSize: textScale(18) }]}>Following</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: moderateScaleVertical(5), marginLeft: moderateScale(3) }}>
                                                <Text style={{ textAlign: 'center', color: '#333', fontFamily: 'Roboto', fontSize: scale(15), fontWeight: '700' }}>{ProfileN.fullName ? ProfileN.fullName : 'NA'}</Text>
                                                <Iconpaid name='verified' size={18} color='#005BD4' style={{ marginLeft: moderateScale(3) }} />
                                            </View>

                                            <ButtonComp text={ProfileN?.userIsFollowing ?'Following':'Follow'} isLoading={isLoading}
                                                style={{ backgroundColor: '#005BD4', width: '40%', height: moderateScale(35), }} onPress={() => {
                                                    handleFollow(item?._id)
                                                }
                                                } />
                                        </View>


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
                                                <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{ProfileN.gender.name}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>University</Text>
                                                <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{ProfileN.study.university ? ProfileN.study.university : 'NA'}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Degree</Text>
                                                <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{ProfileN.study.degree ? ProfileN.study.degree : 'NA'}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Work</Text>
                                                <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{ProfileN.profession.name}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Political Belief</Text>
                                                <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{ProfileN.politicalBelief.name ? ProfileN.politicalBelief.name : 'NA'}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Religious Belief</Text>
                                                <Text style={[styles.txt, { flex: 0.5, textAlign: 'right', fontWeight: '500' }]}>{ProfileN.religiousBelief.name ? ProfileN.religiousBelief.name : 'NA'}</Text>
                                            </View>
                                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                            <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>KYC</Text>
                            <Text style={[styles.txt, { flex: 0.5, textAlign: 'right', fontWeight: '500' }]}>{'Not verified'}</Text>
                        </View> */}
                                        </View>
                                        <View style={{ padding: moderateScaleVertical(15), backgroundColor: '#fff', borderRadius: moderateScale(8), }}>
                                            <Text style={[styles.txt, { textAlign: 'left', fontWeight: 'bold' }]}>Bio</Text>
                                            <Text style={[styles.txt, { textAlign: 'left', fontWeight: '500' }]}>{ProfileN.bio ? ProfileN.bio.description : 'NA'}</Text>
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
                                                }]}>{item}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View> */}
                                        <View>
                                            <Reputation attendence={attendence}/>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: moderateScale(5), marginVertical: moderateScaleVertical(10) }}>
                                            {/* <Image source={imagePath.filter} tintColor={'#333'} resizeMode='contain' style={{ height: moderateScale(20), width: moderateScale(20) }} /> */}
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
                                        <FlatList
                                            data={EventList}
                                            ListEmptyComponent={<View style={{ justifyContent: 'center', alignContent: 'center', height: Dimensions.get('screen').height / 2 }}>
                                                <Text style={[styles.phoneHeading, { fontSize: textScale(18), textAlign: 'center' }]}>{'No Details'}</Text>
                                            </View>}
                                            keyExtractor={(item, index) => index.toString()}
                                            onEndReached={handleEventLoadMore}
                                            onEndReachedThreshold={0.1}
                                            // ListFooterComponent={hasfollowingMore ? <LoaderList /> : null}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <View
                                                        style={{
                                                            borderRadius: moderateScale(10), marginVertical: moderateScaleVertical(10),
                                                            paddingVertical: moderateScaleVertical(10), backgroundColor: '#fff', paddingHorizontal: moderateScale(10)
                                                        }}
                                                    >

                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10), justifyContent: 'space-between' }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                {item?.userId?.profilePicture ? (
                                                                    <Image source={{ uri: item?.userId?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(35), width: moderateScale(35), borderRadius: moderateScale(17) }} />
                                                                ) : (
                                                                    <Image source={imagePath.Gola} resizeMode='contain' style={{ height: moderateScale(35), width: moderateScale(35), borderRadius: moderateScale(17) }} />
                                                                )}
                                                                <Text style={[styles.textone, { marginLeft: moderateScale(10) }]}>{item?.userId?.fullName}</Text>
                                                            </View>
                                                            {/* <Image source={imagePath.dotted}/> */}
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500', marginVertical: moderateScaleVertical(5), flex: 0.6 }]}>Date</Text>
                                                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '600', flex: 0.4 }]}>{moment(item?.dateOfEvent).format('DD MMM YYYY')}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500', flex: 0.6 }]}>Event</Text>
                                                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '600', flex: 0.4 }]}>{item?.name}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500', marginVertical: moderateScaleVertical(5), flex: 0.6 }]}>Event Type</Text>
                                                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '600', flex: 0.4 }]}>{item?.eventType}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '500', flex: 0.6 }]}>Location</Text>
                                                            <Text style={[styles.textone, { color: '#4F4F4F', fontSize: scale(14), fontWeight: '600', paddingBottom: moderateScaleVertical(10), flex: 0.4 }]}>{item?.address}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                            }
                                        />



                                    </>
                                );
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <Loader />
                    )}
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
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(18), textAlign: 'center' }]}>{'No Details'}</Text>
                                </View>}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={handleFollowersLoadMore}
                                onEndReachedThreshold={0.1}
                                // ListFooterComponent={hasfollowingMore ? <LoaderList /> : null}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(20), }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                {item?.profilePicture ? <Image source={{ uri: item?.profilePicture }} style={{ height: moderateScaleVertical(30), width: moderateScale(30), borderRadius: moderateScale(15), alignSelf: 'center', marginVertical: moderateScaleVertical(10) }} /> :
                                                    <Image source={imagePath.Gola} style={{ height: moderateScale(30), width: moderateScale(30), borderRadius: moderateScale(15), alignSelf: 'center', marginVertical: moderateScaleVertical(10) }} />}
                                                <Text style={[styles.phoneHeading, { textAlign: 'center' }]}>{item?.fullName}</Text>
                                            </View>
                                        </View>
                                    )
                                }
                                }
                            />
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
                                        <Text style={[styles.phoneHeading, { fontSize: textScale(18), textAlign: 'center' }]}>{'No Details'}</Text>
                                    </View>}
                                    keyExtractor={(item, index) => index.toString()}
                                    onEndReached={handleFollowingLoadMore}
                                    onEndReachedThreshold={0.1}
                                    //  ListFooterComponent={hasfollowingMore ? <LoaderList /> : null}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(20), flex: 1 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    {item?.profilePicture ? <Image source={{ uri: item?.profilePicture }} style={{ height: moderateScaleVertical(30), width: moderateScale(30), borderRadius: moderateScale(15), alignSelf: 'center', marginVertical: moderateScaleVertical(10) }} /> :
                                                        <Image source={imagePath.Gola} style={{ height: moderateScale(30), width: moderateScale(30), borderRadius: moderateScale(15), alignSelf: 'center', marginVertical: moderateScaleVertical(10) }} />}
                                                    <Text style={[styles.phoneHeading, { textAlign: 'center' }]}>{item?.fullName}</Text>
                                                    <ButtonComp text={'Unfollow'} isLoading={isLoading}
                                                style={{ backgroundColor: '#005BD4', width: '30%', height: moderateScale(35), marginLeft:moderateScale(30)}} onPress={() => {
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
                </View>
            </View>


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
    phoneHeading: {
        fontSize: scale(14),
        fontFamily: 'Roboto',
        fontWeight: '600',
        color: '#333',
        marginLeft:scale(10)
    },
    locationmodalStyle: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        minHeight: moderateScale(height / 3),
    },
    hometxt: {
        color: '#333',
        fontSize: scale(22),
        fontFamily: 'Roboto',
        fontWeight: '800'
    },
    textone: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(20),
        fontWeight: '800'
    },
});

//make this component available to the app
export default OrgProfile;

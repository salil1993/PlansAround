//import liraries
import React, { Component, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, StatusBar, ActivityIndicator, Image, RefreshControl, ScrollView, TouchableOpacity, TouchableOpacityComponent, InputAccessoryView, Alert } from 'react-native'
import { moderateScale, moderateScaleVertical, textScale, scale, height, width } from '../styles/responsiveSize';
import imagePath from '../constants/imagePath';
import IconsettingClose from 'react-native-vector-icons/MaterialCommunityIcons'
import Modal from 'react-native-modal'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/Feather'
import IconsLike from 'react-native-vector-icons/AntDesign'
import IconsComment from 'react-native-vector-icons/Fontisto'
import ButtonComp from './ButtonComp';
import TextInputC from './TextInputC';
import navigationStrings from '../Navigation/navigationStrings';
import { RequestBooking } from '../API/Api';
import Snackbar from 'react-native-snackbar';
import { getData } from '../utils/helperFunctions';
import axios from 'axios';
import Share from 'react-native-share';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loader from './Loader';
// create a component
const HomeEvent = ({ item, Distance, date, UserLocation, handleRefresh, User }) => {

    console.log("item------", JSON.stringify(item));
    const dispatch = useDispatch();
    const scrollViewRef = useRef();
    const navigation = useNavigation();
    const [openModal, setopenModal] = useState(false);
    const [openCommentModal, setopenCommentModal] = useState(false);
    const [openLikesModal, setopenLikesModal] = useState(false)
    const [offset, setoffset] = useState(null)
    const [askPermission, setaskPermission] = useState(false);
    const [Loading, setLoading] = useState(false)
    const [LoadingP, setLoadingP] = useState(false)
    const [Comment, setComment] = useState('')
    const [CommentList, setCommentList] = useState([])
    const [LikesList, setLikesList] = useState([])
    const [selectedImage, setSelectedImage] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    useEffect(() => {

    }, [])
    const openImage = (image) => {
        setSelectedImage(image);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };



    const HandleParticpate = (eventId) => {
        setLoading(true)
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
                    handleRefresh();
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

    const HanldeCheckParticipate = () => {
        setLoadingP(false)
        if (User.kyc.isVerified) {
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


    const handleComments = (event_id) => {
        getCommentList(event_id, 1)
        setopenCommentModal(true)
    }

    const handleLikes = (event_id) => {
        getLikesList(event_id, 1)
        setopenLikesModal(true)
    }

    const handleOnScroll = event => {
        setoffset(event.nativeEvent.contentOffset.y)
    };

    const handleScrollTo = p => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo(p);
        }
    };


    const handleProfile = () => {
        setopenModal(true)
    }

    const handleShare = (id) => {
        Share.open({
            message: `${id}`,
            // url: imageList[0],
        }).then(res => {
            console.log(res);
        }).catch(err => {
            err && console.log(err);
        });
    }

    const getCommentList = async (eventId, pageNumber) => {
        if (Loading) {
            return;
        }
        setLoading(true);
        try {
            let usertoken = await getData('UserToken');
            console.log('userToken', usertoken)
            const headers = {
                'Authorization': `Bearer ${usertoken}`,
                'Content-Type': "application/json",
            };
            //        homepage/events/664781883a31949815756328/comment?page=1&limit=10
            const response = await axios.get(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/${eventId}/comment?page=${pageNumber}&limit=10`, { headers });
            const responseData = response.data;
            console.log(JSON.stringify(responseData), 'totalComments')
            const comments = responseData?.docs;
            //  setCommentList(comments)
            setCommentList((prevComments) => {
                if (pageNumber === 1) {
                    // If it's the first page, replace existing events
                    return comments;
                } else {
                    // If it's not the first page, append new events to the existing list
                    return [...prevComments, ...comments];
                }
            });
            setPage(pageNumber); // Update the current page number
            setLoading(false);
            if (comments?.length <= responseData?.totalDocs) {
                setHasMore(true);
            } else {
                setHasMore(false);
            }
            // Update hasMore based on whether new events were fetched
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const getLikesList = async (eventId, pageNumber) => {
        if (Loading) {
            return;
        }
        setLoading(true);
        try {
            let usertoken = await getData('UserToken');
            console.log('userToken', usertoken)
            const headers = {
                'Authorization': `Bearer ${usertoken}`,
                'Content-Type': "application/json",
            };
            //        homepage/events/664781883a31949815756328/comment?page=1&limit=10
            const response = await axios.get(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/${eventId}/likes?page=${pageNumber}&limit=10`, { headers });
            const responseData = response?.data;
            console.log(JSON.stringify(responseData), 'totalComments')
            const likes = responseData?.data?.likedUsers;
            //  setCommentList(comments)
            setLikesList((prevLikes) => {
                if (pageNumber === 1) {
                    // If it's the first page, replace existing events
                    return likes;
                } else {
                    // If it's not the first page, append new events to the existing list
                    return [...prevLikes, ...likes];
                }
            });
            setPage(pageNumber); // Update the current page number
            setLoading(false);
            if (likes?.length <= responseData?.totalDocs) {
                setHasMore(true);
            } else {
                setHasMore(false);
            }
            // Update hasMore based on whether new events were fetched
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    // Define your function for handling load more
    const handleLoadMore = () => {
        if (!Loading && hasMore) {
            getCommentList(page + 1);
        }
    };

    const postComment = async (event_id) => {
        let usertoken = await getData('UserToken');
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
        };
        axios.post(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/${event_id}/comment`, { "comment": Comment }, { headers })
            .then((res) => {
                console.log('PostComment', res)
                getCommentList(event_id, 1);
                setComment('')
                handleRefresh()
            }).
            catch((err) => {
                console.log('PostComment', err)

            })
    }

    const postLikes = async (event_id) => {
        let usertoken = await getData('UserToken');
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
        };
        console.log(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/${event_id}/likes`)
        axios.post(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/${event_id}/likes`, null, { headers })
            .then((res) => {
                console.log('LikesRes', res)
                getLikesList(event_id, 1);
                handleRefresh()
            }).
            catch((err) => {
                console.log('LikesErr', err)
            })
    }

    const postUnlikes = async (event_id) => {
        let usertoken = await getData('UserToken');
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
        };

        axios.post(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/${event_id}/unlike`, null, { headers })
            .then((res) => {
                console.log('LikesRes', res)
                getLikesList(event_id, 1);
                handleRefresh()
            }).
            catch((err) => {
                console.log('LikesErr', err)
            })
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
                setopenModal(false)
                //  getOrgProfile()
                Snackbar.show({
                    text: `${res?.data?.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });
            })
            .catch((error) => {
                console.log(error?.response?.data?.message);
                setopenModal(false)
                Snackbar.show({
                    text: `${error?.response?.data?.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    textColor: "#fff",
                });
            });
    }




    return (
        <>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                    <TouchableOpacity onPress={() => navigation.navigate(navigationStrings.ORGPROFILE, { Profile: item?.userId })} style={{ flexDirection: 'row', alignItems: 'center' }} >
                        {
                            item?.user?.profilePicture ?
                                <Image source={{ uri: item?.user?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                :
                                <Image source={imagePath.Gola} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                        }
                        <Text style={styles.charlie}>{item.user.fullName ? item.user.fullName : 'NA'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleProfile}>
                        <IconsettingClose name='dots-vertical' size={30} color='#333' />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text onPress={() => navigation.navigate(navigationStrings.HOMEEVENTDETAILS, { Id: item._id })} style={styles.eventtxt}>Made an event for <Text style={[styles.eventtxt, { color: '#333', fontWeight: '900' }]}>{item.name ? item.name : 'NA'}</Text>
                        </Text>
                        {item.subCategory.icon ?
                            <Image source={{ uri: item.subCategory.icon }} style={{ height: moderateScale(20), width: moderateScale(20), borderRadius: moderateScale(10), marginLeft: moderateScale(8) }} resizeMode='contain' />
                            :
                            <Image source={imagePath.bTennis} />
                        }
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
                        <TouchableOpacity onPress={() => navigation.navigate(navigationStrings.SHOWONMAP, { Elocation: item.location, Ulocation: UserLocation, type: 'HomeEvent' })} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={imagePath.Gmap} style={{ height: moderateScaleVertical(30), width: moderateScale(30) }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={styles.eventtxt}>Event Type</Text>
                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.eventType ? item.eventType : 'NA'}</Text>
                </View>
                {
                    item.amount > 0 &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                        <Text style={styles.eventtxt}>Amount</Text>
                        <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.amount ? item.amount : 'NA'} $</Text>
                    </View>
                }
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <Text style={styles.eventtxt}>No. of People Required</Text>
                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>Min: {item.minPeople ? item.minPeople : 'NA'}- Max: {item.maxPeople ? item.maxPeople : 'NA'}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <Text style={styles.eventtxt}>No. of Participant Approved</Text>
                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>2</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <Text style={styles.eventtxt}>Date & Time</Text>
                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{date ? date[0] : 'NA'}, {item.time.start ? item.time.start : 'NA'} - {item.time.end ? item.time.end : 'NA'}</Text>
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
                    <TouchableOpacity style={{ marginTop: moderateScale(5) }} onPress={() => navigation.navigate(navigationStrings.HOMEEVENTDETAILS, { Id: item._id })}>
                        <Text style={[styles.eventtxt, { fontWeight: '700', color: '#005BD4', textAlign: 'right' }]}>View more...</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                        <View style={{ width: '50%', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => handleLikes(item?._id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => item?.userHasLiked ? postUnlikes(item?._id) : postLikes(item?._id)}>
                                        <IconsLike name='like2' size={20} color={item?.userHasLiked ? 'red' : '#333'} />
                                    </TouchableOpacity>
                                    <Text style={[styles.eventtxt, { marginLeft: moderateScale(5) }]}>{item?.likesCount}</Text>

                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleComments(item?._id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <IconsComment name='comment' size={20} color='#333' />
                                    <Text style={[styles.eventtxt, { marginLeft: moderateScale(10) }]}>{item?.commentCount}</Text>

                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleShare(item?._id)} style={{ marginRight: moderateScale(15) }}>
                                    <IconsLike name='sharealt' size={20} color='#333' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ButtonComp text='Participate' isLoading={LoadingP}
                            style={{ backgroundColor: '#005BD4', width: '50%' }} onPress={() => {
                                setLoadingP(true)
                                setTimeout(() => {
                                    HanldeCheckParticipate();
                                }, 1000);
                            }
                            } />
                    </View>
                </View>
                <Modal
                    swipeDirection={'down'}
                    // onSwipeStart={() => setopenModal(false)}
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
                                {
                                    item?.user?.profilePicture ?
                                        <Image source={{ uri: item?.user?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                        :
                                        <Image source={imagePath.Gola} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                }
                                <Text style={[styles.hometxt, { marginLeft: moderateScale(5) }]}>{item.user.fullName || 'NA'}</Text>
                            </View>
                            {/* <TouchableOpacity onPress={() => setopenModal(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity> */}
                        </View>
                        <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(15) }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setopenModal(false)
                                    setTimeout(() => {
                                        navigation.navigate(navigationStrings.ORGPROFILE, { Profile: item?.userId })
                                    }, 100);
                                }}
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                <Text style={styles.txt}>Visit Organiser Profile</Text>
                                <IconsLike name='user' size={20} color='#4F4F4F' />
                            </TouchableOpacity>
                            <View style={{
                                borderWidth: 0.2, borderBottomColor: '#BDBDBD'
                            }} />
                            <TouchableOpacity
                                onPress={() => { handleShare(item?._id) }}
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                <Text style={styles.txt}>Share</Text>
                                <IconsLike name='sharealt' size={20} color='#4F4F4F' />
                            </TouchableOpacity>
                            <View style={{
                                borderWidth: 0.2, borderBottomColor: '#BDBDBD'
                            }} />
                            <TouchableOpacity
                                onPress={() => {
                                    alert("Coming soon!")
                                }}
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                <Text style={styles.txt}>Mark as Favourite</Text>
                                <IconsLike name='hearto' size={20} color='#4F4F4F' />
                            </TouchableOpacity>
                            <View style={{
                                borderWidth: 0.2, borderBottomColor: '#BDBDBD'
                            }} />
                            <TouchableOpacity
                                onPress={() => {
                                    alert("Coming soon!")
                                }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                <Text style={styles.txt}>Save the Event Post</Text>
                                <Icons name='save' size={20} color='#4F4F4F' />
                            </TouchableOpacity>
                            <View style={{
                                borderWidth: 0.2, borderBottomColor: '#BDBDBD'
                            }} />
                            {/* <TouchableOpacity onPress={() => handleFollow(item?._id)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                <Text style={styles.txt}>Follow</Text>
                                <IconsLike name='adduser' size={20} color='#4F4F4F' />
                            </TouchableOpacity> */}
                            <View style={{
                                borderWidth: 0.2, borderBottomColor: '#BDBDBD'
                            }} />
                            <TouchableOpacity
                                onPress={() => {
                                    alert("Coming soon!")
                                }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                <Text style={styles.txt}>Report a Problem</Text>
                                <IconsLike name='exclamationcircleo' size={20} color='#EB5757' />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {/* ------------------Comment List------------------ */}
                <Modal
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
                    <SafeAreaView style={[styles.modalStyle, { height: 500 }]}>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: moderateScale(20), marginHorizontal: moderateScale(5), }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={[styles.hometxt, { fontSize: moderateScale(16) }]}>Comments</Text>

                            </View>
                            <TouchableOpacity onPress={() => setopenCommentModal(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                        </View>
                        <KeyboardAwareScrollView
                            keyboardShouldPersistTaps={'handled'}
                            style={{ flex: 1 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ height: 370 }}>
                                {Loading ? <Loader /> :
                                    <FlatList
                                        style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(15) }}
                                        ListEmptyComponent={<View style={{ flex: 1, height: height / 3.5, width: width, justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontSize: scale(15), color: '#4F4F4F', fontWeight: '700' }}>There is no comments.</Text></View>}
                                        data={CommentList}
                                        contentContainerStyle={{ paddingBottom: 20 }}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                        {item?.user?.profilePicture != null ?
                                                            <Image style={{ resizeMode: 'contain', height: moderateScale(30), width: moderateScale(30) }} source={{ url: item?.user?.profilePicture }} />
                                                            : <Image source={imagePath.Gola} style={{ resizeMode: 'contain', height: moderateScale(30), width: moderateScale(30) }} />}

                                                        <View>
                                                            <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(18), textTransform: 'capitalize' }]}>{item?.user?.fullName}</Text>
                                                            <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(14), fontWeight: '400' }]}>{item?.comment}</Text>
                                                        </View>
                                                    </View>
                                                </>
                                            )
                                        }
                                        }
                                    />
                                }
                            </View>


                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginHorizontal: moderateScale(10) }}>
                                <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(500), padding: moderateScale(10), marginRight: moderateScale(10), alignItems: 'center' }}>
                                    <IconsLike name='tag' color='#005BD4' size={25} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInputC
                                        placeholder={'Leave your comment'}
                                        autoFocus={true}
                                        editable={true}
                                        iconname={'send'}
                                        isrightIcon={true}
                                        value={Comment}
                                        onPressComment={() => postComment(item?._id)}
                                        onChangeText={(text) => { setComment(text) }}
                                        style={{ height: moderateScale(50) }}
                                    />
                                </View>

                            </View>
                        </KeyboardAwareScrollView>
                    </SafeAreaView>
                </Modal>
                {/*------------------ Likes List----------------- */}
                <Modal
                    hasBackdrop={true}
                    coverScreen={true}
                    backdropColor="#000"
                    backdropOpacity={0.5}
                    onBackdropPress={() => setopenLikesModal(false)}
                    isVisible={openLikesModal}
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
                    <View style={[styles.modalStyle, { height: 500 }]}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.hometxt, { marginLeft: moderateScale(5), fontSize: moderateScale(16) }]}>Likes</Text>

                            </View>
                            <TouchableOpacity onPress={() => setopenLikesModal(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            {Loading ? <Loader /> :
                                <FlatList
                                    style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(15) }}
                                    ListEmptyComponent={<View style={{ flex: 1, height: height / 3.5, width: width, justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontSize: scale(15), color: '#4F4F4F', fontWeight: '700' }}>There is no Likes on this event.</Text></View>}
                                    data={LikesList}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                                                    {item?.user?.profilePicture != null ? <Image style={{ resizeMode: 'contain', height: moderateScale(30), width: moderateScale(30) }} source={{ url: item?.user?.profilePicture }} /> : <Image style={{ resizeMode: 'contain', height: moderateScale(30), width: moderateScale(30) }} source={imagePath.Gola} />}

                                                    <View>
                                                        <Text style={[styles.hometxt, { marginLeft: moderateScale(8), fontSize: textScale(18), textTransform: 'capitalize' }]}>{item?.fullName}</Text>
                                                    </View>
                                                </View>
                                            </>
                                        )
                                    }
                                    }
                                />
                            }
                        </View>


                    </View>
                </Modal>
            </View>
            <View>
                <Modal
                    isVisible={askPermission}
                    backdropColor="#000"
                    backdropOpacity={0.8}
                    hasBackdrop={true}
                    // animationIn="zoomInDown"
                    // animationOut="zoomOutUp"
                    // animationInTiming={600}
                    animationOutTiming={900}
                // backdropTransitionInTiming={600}
                // backdropTransitionOutTiming={600}
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
                                <ButtonComp isLoading={Loading} onPress={() => HandleParticpate(item._id)} text='Continue' style={{ height: moderateScale(45), backgroundColor: '#005BD4' }} />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <View>
                <Modal visible={selectedImage !== null} transparent={true} onBackdropPress={closeImage} hasBackdrop={true}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeImage}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />
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
        backgroundColor: '#fff',
        paddingHorizontal: moderateScale(12),
        elevation: 3,
        marginVertical: moderateScaleVertical(10),
        borderRadius: moderateScale(5)
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
        minHeight: moderateScale(height / 6),
        borderRadius: moderateScale(15),
        width: moderateScale(width / 2),
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
    modalContainer: {
        flex: 1 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    fullScreenImage: {
        width: '70%',
        height: '70%',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    closeButtonText: {
        color: 'white',
        fontSize: textScale(16),
        fontFamily: 'Roboto',
        fontWeight: '700',
    },

});

export default HomeEvent;

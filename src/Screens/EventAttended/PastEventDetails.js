import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, Image, TouchableOpacity, ScrollView, PermissionsAndroid, ToastAndroid, SafeAreaView } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale, moderateScaleVertical, scale, textScale, height, width } from '../../styles/responsiveSize';
import Loader from '../../Components/Loader';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import imagePath from '../../constants/imagePath';
import Icon from 'react-native-vector-icons/MaterialIcons'
import navigationStrings from '../../Navigation/navigationStrings';
import ButtonComp from '../../Components/ButtonComp';
import { useSelector } from 'react-redux';
import { TextInput } from 'react-native-gesture-handler';
import { Rating, AirbnbRating } from 'react-native-ratings';
import IconsLike from 'react-native-vector-icons/AntDesign'
import Modal from 'react-native-modal'
import Snackbar from 'react-native-snackbar';
const PastEventDetails = ({ navigation, route }) => {
    const CurrentUserLocation = useSelector((state) => state.persistedReducer.authSlice.userCurrentLocation);
    const item = route?.params?.item
    const [reviewModal, setreviewModal] = useState(false)
    const [ReviewList, setReviewList] = useState([])
    const [ReviewDetail, setReviewDetail] = useState([])
    const [rating, setRating] = useState([]);
    console.log("item----", item);
    const UserLocation = CurrentUserLocation;
    const Eventlocation = item.event.location;
    console.log("UserLocation----", UserLocation);
    console.log("Eventlocation----", Eventlocation);
    const Distance = calculateDistance(UserLocation.latitude, UserLocation.longitude, Eventlocation.coordinates[0], Eventlocation.coordinates[1])
    const date = item.event.dateOfEvent.split('T')

    useEffect(() => {
        getReviewList();
        getReview();
    }, [])


    const getReview = async () => {
        //  setLoadEvents(true)
        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        axios.get(`https://plansaround-backend.vercel.app/api/mobile/homepage/events/${item.event._id}`, { headers })
            .then((res) => {
                console.log(res.data.review, 'review screen')
                setReviewDetail(res.data.review)
                // setLoadEvents(false)
            }).
            catch((err) => {
                console.log(err)
                //setLoadEvents(false)
            })
    }

    const getReviewList = async () => {
        //  setLoadEvents(true)
        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        axios.get(`https://plansaround-backend.vercel.app/api/mobile/review`, { headers })
            .then((res) => {
                console.log("reviewList----", res.data.reviews);
                setReviewList(res.data.reviews)
                let rate = []
                res.data.reviews.map(res=>{
                    rate.push(0)
                })
                setRating(rate)
                // setLoadEvents(false)
            }).
            catch((err) => {
                console.log(err)
                //setLoadEvents(false)
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

    const postReview = async () => {
        let reviews =  ReviewList.map((res, index)=>{
            return {id: res?._id, rating: rating[index]}
        });
        let usertoken = await getData('UserToken');

        const headers = {
            'Authorization':`Bearer ${usertoken}`,
            'Content-Type':"application/json",
        };
        console.log('datatatatta', {"reviews":reviews, "bookingId":item._id})
        axios.post(`https://plansaround-backend.vercel.app/api/mobile/review/event-review`, {"reviews":reviews, "bookingId":item._id}, { headers }).then((res) => {
                console.log('postReviewRes', res)
                setreviewModal(false)
                Snackbar.show({
                    text: `${res.data.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });
            }).catch((err) => {
                console.log('postReviewErr', err.response.data.message)
                setreviewModal(false)
                Snackbar.show({
                    text: `${err.response.data.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                  });

            })
    }

 
    return (
        <WrapperContainer>
            <HeaderBack mainText='Event details' isLeftImage={true} />
            <ScrollView>
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
                            <TouchableOpacity onPress={() => navigation.navigate(navigationStrings.SHOWONMAP, { Elocation: item.event.location, Ulocation: UserLocation, type: 'EventAttended' })} style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                            <Text style={[styles.eventtxt, { fontWeight: '500', textTransform: 'capitalize' }]}>{"Attended"}</Text>
                        </View>

                        <Text style={[styles.eventtxt, { fontWeight: '800', textTransform: 'capitalize', fontSize: textScale(18), marginTop: 10 }]}>Reviews</Text>

                        <FlatList
                            style={{ marginTop: 10, marginBottom: 20 }}
                            data={ReviewDetail}
                            numColumns={2}
                            scrollEnabled={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#828282', padding: moderateScale(8), borderRadius: moderateScale(5) }}>
                                            <Text style={[styles.txt, { color: '#fff', fontWeight: '700', }]}>{item?.reviewName}</Text>
                                            <Text style={[styles.txt, { color: '#fff', fontWeight: '500', }]}>{'(' + item?.averageRating + ')'}</Text>
                                        </View>
                                    </View>
                                )
                            }}
                            ItemSeparatorComponent={<View style={{ height: 1, width: "100%", backgroundColor: "#cfecf7" }} />}
                        />

                        <ButtonComp
                            onPress={() => setreviewModal(true)}
                            text="Add review"
                            style={{ backgroundColor: '#005BD4', marginVertical: moderateScaleVertical(5) }} />
                    </View>
                </View>
                <View>

                </View>
            </ScrollView>
            <Modal
                hasBackdrop={true}
                coverScreen={true}
                backdropColor="#000"
                backdropOpacity={0.8}
                isVisible={reviewModal}
                style={{ justifyContent: 'flex-end', margin: 0, }}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={1000}
                animationOutTiming={900}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
            >
                <SafeAreaView style={{
                    flex: 0.4,
                    backgroundColor: '#F2F2F2',
                    minHeight: moderateScale(height / 2.5),
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                        <TouchableOpacity onPress={() => setreviewModal(false)}>
                            <IconsLike name='down' size={26} color='#333' style={{ marginLeft: moderateScale(5) }} />
                        </TouchableOpacity>
                        <Text style={styles.charlie}>Add Review</Text>
                    </View>


                    <FlatList
                        style={{ marginTop: 10, marginBottom: 20 }}
                        data={ReviewList}
                        scrollEnabled={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                    <Text style={[{
                                        color: '#333', fontWeight: '700', fontSize: scale(16),
                                        fontFamily: 'Roboto',
                                    }]}>{item?.name}</Text>
                                    <Rating
                                        ratingCount={5}
                                        imageSize={25}
                                        // ratingBackgroundColor={'#FFF'}
                                        tintColor={'#F2F2F2'}
                                        onFinishRating={rateValue => {
                                            let ratingArr =  rating
                                            ratingArr[index] = rateValue
                                            setRating(ratingArr);
                                        }}
                                 
                                        style={{
                                            alignSelf: 'flex-start',
                                            marginTop: 10,
                                        }}
                                        startingValue={rating[index]}
                                    />
                                </View>
                            )
                        }}
                        ItemSeparatorComponent={<View style={{ height: 1, width: "100%", backgroundColor: "#E8E6EA" }} />}
                    />

                    <ButtonComp
                        onPress={() => { 
                            
                            postReview()
                   
                        }}
                        text="Submit review"
                        style={{ backgroundColor: '#005BD4', marginVertical: moderateScaleVertical(5), marginHorizontal: moderateScale(20) }} />

                </SafeAreaView>
            </Modal>
        </WrapperContainer>
    )
}


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

export default PastEventDetails
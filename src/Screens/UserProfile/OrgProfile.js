//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity, Image } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale, moderateScaleVertical, scale, textScale } from '../../styles/responsiveSize';
import Loader from '../../Components/Loader';
import imagePath from '../../constants/imagePath';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import Iconpaid from 'react-native-vector-icons/MaterialIcons'
import Reputation from '../../Components/Reputation';

// create a component
const OrgProfile = ({ navigation, route }) => {
    const Profile = route.params.Profile;
    const [LoadEvents, setLoadEvents] = useState(false);
    const [ProfileN, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [Gcategory, setGcategory] = useState(1)
    let DOB = ProfileN?.dateOfBirth?.split('T');
    //console.log('DOB--->>', DOB)
    const age = DOB != undefined && calculateAge(DOB[0]);
    useEffect(() => {
        getOrgProfile()
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
                const newProfile = responseData?.user;
                console.log(newProfile, 'profileeeeee')
                setProfile(newProfile)

                setIsLoading(false);
            }).
            catch((err) => {
                console.log(err)
                setIsLoading(false);
            })
};

   
    return (
        <WrapperContainer>
            <HeaderBack mainText={ProfileN?.fullName ? ProfileN?.fullName : 'User'} style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    {ProfileN ? (
                        <FlatList
                            data={[ProfileN]} // Wrap ProfileN in an array
                            renderItem={({ item }) => {
                                console.log('item--->>', item)
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
                                                    <Text style={[styles.hometxt, { textAlign: 'center', fontSize: textScale(20) }]}>3</Text>
                                                    <Text style={[styles.textone, { fontWeight: '500', fontSize: textScale(18) }]}>Events</Text>
                                                </View>
                                                <View>
                                                    <Text style={[styles.hometxt, { textAlign: 'center', fontSize: textScale(20) }]}>108</Text>
                                                    <Text style={[styles.textone, { fontWeight: '500', fontSize: textScale(18) }]}>Followers</Text>
                                                </View>
                                                <View>
                                                    <Text style={[styles.hometxt, { textAlign: 'center', fontSize: textScale(20) }]}>89</Text>
                                                    <Text style={[styles.textone, { fontWeight: '500', fontSize: textScale(18) }]}>Following</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: moderateScaleVertical(5), marginLeft: moderateScale(3) }}>
                        <Text style={{ textAlign: 'center', color: '#333', fontFamily: 'Roboto', fontSize: scale(15), fontWeight: '700' }}>{ProfileN.fullName ? ProfileN.fullName : 'NA'}</Text>
                        <Iconpaid name='verified' size={18} color='#005BD4' style={{ marginLeft: moderateScale(3) }} />
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
                        <Reputation />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: moderateScale(5), marginVertical: moderateScaleVertical(10) }}>
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
                    </View>
                    <View
                        style={{
                            borderRadius: moderateScale(10),
                            paddingVertical: moderateScaleVertical(10), backgroundColor: '#fff', paddingHorizontal: moderateScale(10)
                        }}
                    >

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10), justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={imagePath.frame2} />
                                <Text style={[styles.textone, { marginLeft: moderateScale(10) }]}>Charlie Harper</Text>
                            </View>
                            {/* <Image source={imagePath.dotted}/> */}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                        </View>
                    </View>
                    <View
                        style={{
                            borderRadius: moderateScale(10), marginVertical: moderateScaleVertical(10),
                            paddingVertical: moderateScaleVertical(10), backgroundColor: '#fff', paddingHorizontal: moderateScale(10)
                        }}
                    >

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10), justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={imagePath.frame2} />
                                <Text style={[styles.textone, { marginLeft: moderateScale(10) }]}>Charlie Harper</Text>
                            </View>
                            {/* <Image source={imagePath.dotted}/> */}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                        </View>
                    </View>



                                    </>
                                );
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <Loader />
                    )}
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

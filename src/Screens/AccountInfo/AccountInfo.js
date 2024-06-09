import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import WrapperContainer from '../../Components/WrapperContainer'
import HeaderBack from '../../Components/HeaderBack'
import { height, moderateScale, moderateScaleVertical, scale, textScale } from '../../styles/responsiveSize'
import { useSelector } from 'react-redux'
import Iconpaid from 'react-native-vector-icons/MaterialIcons'
import { getData } from '../../utils/helperFunctions'
import axios from 'axios'
import imagePath from '../../constants/imagePath'
import Reputation from '../../Components/Reputation'
import Loader from '../../Components/Loader'

const AccountInfo = () => {
    const item = useSelector((state) => state?.persistedReducer?.authSlice?.userData);
    console.log("item====", item);
    const [ProfileN, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [age, setAge] = useState("0")
    useEffect(() => {
        getOrgProfile(item?._id)
    }, [])

    const getOrgProfile = async (id) => {

        setIsLoading(true);

        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        let EndPoint = `https://plansaround-backend.vercel.app/api/mobile/homepage/events/organiser/${id}/detail`
        console.log('EndPoint', EndPoint)
        axios.get(EndPoint, { headers })
            .then((res) => {
                const responseData = res?.data;
                const newProfile = responseData?.user;
                console.log(newProfile, 'profileeeeee')
                setProfile(newProfile)
                setAge(calculateAge(newProfile?.dateOfBirth))
                setIsLoading(false);
            }).
            catch((err) => {
                console.log(err)
                setIsLoading(false);
            })
    };
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
    return (
        <WrapperContainer style={{ backgroundColor: '#fff' }}>
            <HeaderBack
                style={{ marginLeft: moderateScale(10) }}
                mainText='Account Information'
                maintxtstyle={{ fontSize: textScale(18) }} />

            {isLoading ? <Loader /> : <>
                <View style={{ alignSelf: "center" }}>


                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ width: '35%' }}>
                            {ProfileN?.profilePicture ? (
                                <Image source={{ uri: ProfileN?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(100), width: moderateScale(100), borderRadius: moderateScale(50) }} />
                            ) : (
                                <Image source={imagePath.Gola} resizeMode='contain' style={{ height: moderateScale(100), width: moderateScale(100), borderRadius: moderateScale(50) }} />
                            )}
                        </TouchableOpacity>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: moderateScaleVertical(5), }}>
                            <Text style={{ textAlign: 'center', color: '#333', fontFamily: 'Roboto', fontSize: scale(15), fontWeight: '700' }}>{ProfileN?.fullName || ""}</Text>
                            <Iconpaid name='verified' size={18} color='#005BD4' style={{ marginLeft: moderateScale(3) }} />
                        </View>


                    </View>
                </View>

                <View style={{ padding: moderateScaleVertical(15), backgroundColor: '#fff', borderRadius: moderateScale(8), marginVertical: moderateScaleVertical(15) }}>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                            <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Date of Birth</Text>
                            <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{DOB[0]}</Text>
                        </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                        <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Age</Text>
                        <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{age ? age : ''} yrs.</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                        <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Gender</Text>
                        <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{ProfileN?.gender.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                        <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>University</Text>
                        <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{ProfileN?.study.university ? ProfileN?.study.university : ''}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                        <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Degree</Text>
                        <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{ProfileN?.study.degree ? ProfileN?.study.degree : ''}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                        <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Work</Text>
                        <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{ProfileN?.profession.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                        <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Political Belief</Text>
                        <Text style={[styles.txt, { fontWeight: '500', flex: 0.5, textAlign: 'right' }]}>{ProfileN?.politicalBelief.name ? ProfileN?.politicalBelief.name : ''}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                        <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>Religious Belief</Text>
                        <Text style={[styles.txt, { flex: 0.5, textAlign: 'right', fontWeight: '500' }]}>{ProfileN?.religiousBelief.name ? ProfileN?.religiousBelief.name : ''}</Text>
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: moderateScaleVertical(5) }}>
                            <Text style={[styles.txt, { flex: 0.5, textAlign: 'left', }]}>KYC</Text>
                            <Text style={[styles.txt, { flex: 0.5, textAlign: 'right', fontWeight: '500' }]}>{'Not verified'}</Text>
                        </View> */}
                </View>
                <View style={{ padding: moderateScaleVertical(15), backgroundColor: '#fff', borderRadius: moderateScale(8), }}>
                    <Text style={[styles.txt, { textAlign: 'left', fontWeight: 'bold' }]}>Bio</Text>
                    <Text style={[styles.txt, { textAlign: 'left', fontWeight: '500' }]}>{ProfileN?.bio ? ProfileN?.bio.description : ''}</Text>
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



            </>}

        </WrapperContainer>
    )
}
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
        marginLeft: scale(10)
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


export default AccountInfo
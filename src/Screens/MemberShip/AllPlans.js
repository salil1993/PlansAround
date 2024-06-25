//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground, Image, FlatList } from 'react-native';
import { height, moderateScale, moderateScaleVertical, scale, textScale } from '../../styles/responsiveSize';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import imagePath from '../../constants/imagePath';
import ButtonComp from '../../Components/ButtonComp';
import navigationStrings from '../../Navigation/navigationStrings';
import axios from 'axios';
import { getData } from '../../utils/helperFunctions';
import Loader from '../../Components/Loader';
// create a component
const AllPlans = ({ navigation }) => {
    const [Packages, setPackages] = useState('');
    const [LoadEvent, setLoadEvent] = useState(false)

    useEffect(() => {
        getPlans();
    }, [])
    const getPlans = async () => {
        setLoadEvent(true);
        // setLoadEvent(true)
        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': 'multipart/form-data',
        };
        axios.get('https://plansaround-backend.vercel.app/api/mobile/packages', { headers })
            .then((res) => {
                console.log(res, 'total package')
                setLoadEvent(false);
                setPackages(res.data.packages)
                // setEventData(res.data.events)
                // setLoadEvent(false)
            }).
            catch((err) => {
                console.log(err)
                // setLoadEvent(false)
            })
    }



    return (
        <WrapperContainer>
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <HeaderBack mainText='All Packages' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <View style={[styles.container, { padding: 5 }]}>
                <ImageBackground source={imagePath.BackPro} resizeMode="cover" style={{ height: moderateScale(170), width: '100%' }}>
                    <Image source={imagePath.craft} style={{ position: 'absolute', bottom: -6, left: 20 }} />
                </ImageBackground>

                {
                    LoadEvent ? <Loader /> :
                        <View>
                            <FlatList
                                data={Packages}
                                ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: scale(18), color: '#4F4F4F', fontWeight: '700' }}>There is No Active Event.</Text></View>}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ paddingHorizontal: moderateScale(10) }}>
                                            <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(20), marginVertical: moderateScaleVertical(20) }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                    <View style={{ flex: 0.8 }}>
                                                        <Text style={[styles.phoneHeading, { fontSize: textScale(18) }]}>{item.longDescription ? item.longDescription : 'NA'}</Text>
                                                        <Text style={[styles.phoneHeading, { fontSize: textScale(14), fontWeight: '400', marginVertical: moderateScaleVertical(10) }]}>{item.shortDescription ? item.shortDescription : 'NA'}</Text>
                                                    </View>
                                                    <Image source={{ uri: item.image }} style={{ height: moderateScaleVertical(150), width: moderateScale(150), flex: 0.8, borderRadius: moderateScale(75) }} />
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: moderateScaleVertical(10) }}>
                                                    <ButtonComp onPress={() =>
                                                        navigation.navigate(navigationStrings.PLANSDETAILS, { id: item._id })
                                                    } text='View Package' style={{ backgroundColor: '#005BD4', width: '46%', height: moderateScale(35) }} />
                                                    <ButtonComp

                                                        text='Pay Now'
                                                        onPress={() =>
                                                            navigation.navigate(navigationStrings.PLANSDETAILS, { id: item._id })
                                                        }
                                                        style={{ backgroundColor: '#005BD4', width: '46%', height: moderateScale(35) }} />
                                                </View>
                                            </View>
                                        </View>
                                    )

                                }}

                            />

                        </View>
                }
            </View>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: moderateScale(12),
        backgroundColor: '#F2F2F2'
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
    textone: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(20),
        fontWeight: '800'
    },
    // image: {
    //     flex: 1,
    //     justifyContent: 'center',
    // },
});

//make this component available to the app
export default AllPlans;

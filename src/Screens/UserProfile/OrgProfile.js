//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity, Image } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale, scale, textScale } from '../../styles/responsiveSize';
import Loader from '../../Components/Loader';
import imagePath from '../../constants/imagePath';

// create a component
const OrgProfile = ({ navigation, route }) => {
    const Profile = route.params.Profile;
    const [LoadEvents, setLoadEvents] = useState(false);
    const [ProfileN, setProfile] = useState(null);

    useEffect(() => {
        if (Profile) {
            setProfile(Profile);
        }
    }, [Profile]);
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
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'red' }}>Coming soon.....</Text>
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

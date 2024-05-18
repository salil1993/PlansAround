//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale, moderateScaleVertical, textScale, scale } from '../../styles/responsiveSize';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Iconsetting from 'react-native-vector-icons/MaterialIcons'
import navigationStrings from '../../Navigation/navigationStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { userStatus } from '../../redux/Slices/UserSlice';
// create a component
const Settings = ({ navigation }) => {
    const dispatch = useDispatch();
    return (
        <WrapperContainer style={{ backgroundColor: '#fff' }}>
            <HeaderBack style={{ marginLeft: moderateScale(10) }} mainText='Settings' maintxtstyle={{ fontSize: textScale(18) }} />
            <View style={{ borderWidth: 0.5, borderColor: '#fffafa', marginTop: moderateScaleVertical(10) }} />
            <View style={styles.container}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(20) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Iconsetting name='account-circle' size={20} color='#4F4F4F' />
                        <Text style={styles.settingsText}>Account information</Text>
                    </View>
                    <MIcon name='arrow-right-circle-outline' size={23} color={'#4F4F4F'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate(navigationStrings.PACKAGEPURCHASED)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScaleVertical(20) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Iconsetting name='account-circle' size={20} color='#4F4F4F' />
                        <Text style={styles.settingsText}>Membership Purchase History</Text>
                    </View>
                    <MIcon name='arrow-right-circle-outline' size={23} color={'#4F4F4F'} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Iconsetting name='verified' size={20} color='#4F4F4F' />
                        <Text style={styles.settingsText}>KYC Verification</Text>
                    </View>
                    <MIcon name='arrow-right-circle-outline' size={23} color={'#4F4F4F'} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginVertical: moderateScaleVertical(20), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Iconsetting name='notifications-on' size={20} color='#4F4F4F' />

                        <Text style={styles.settingsText}>Notifications</Text>
                    </View>
                    <MIcon name='arrow-right-circle-outline' size={23} color={'#4F4F4F'} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Iconsetting name='help' size={20} color='#4F4F4F' />

                        <Text style={styles.settingsText}>Help & Support</Text>
                    </View>
                    <MIcon name='arrow-right-circle-outline' size={23} color={'#4F4F4F'} />
                </TouchableOpacity>

            </View>
            <View style={{ borderWidth: 0.5, borderColor: '#fffafa', marginVertical: moderateScaleVertical(20) }} />
            <View style={styles.container}>
                <TouchableOpacity onPress={async () => {
                    await AsyncStorage.removeItem('UserToken');
                    dispatch(userStatus(false))
                }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Iconsetting name='logout' size={23} color='#005BD4' />
                        <Text style={[styles.settingsText, { color: '#005BD4' }]}>Logout</Text>
                    </View>
                    <MIcon name='arrow-right-circle-outline' size={23} color={'#005BD4'} />
                </TouchableOpacity>

            </View>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        padding: moderateScale(10),
        paddingHorizontal: moderateScale(10),

    },
    settingsText: {

        color: '#000',
        fontSize: textScale(16),
        fontFamily: 'Roboto',
        fontWeight: '600',
        marginLeft: moderateScale(7)

    }
});

//make this component available to the app
export default Settings;

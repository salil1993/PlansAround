import React, { useEffect } from 'react';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import colors from '../styles/colors';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Screens from '../Screens';
import { height, moderateScale } from '../styles/responsiveSize';
import imagePath from '../constants/imagePath';
import navigationStrings from './navigationStrings';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Check from 'react-native-vector-icons/Ionicons'
import Wifi from 'react-native-vector-icons/MaterialIcons'
import User from 'react-native-vector-icons/FontAwesome6'
import { useSelector } from 'react-redux';
import { getData } from '../utils/helperFunctions';
import axios from 'axios';
const BottomTab = createBottomTabNavigator();

const TabRoutes = (props) => {
    const user = useSelector((state) => state.persistedReducer.authSlice.userData);
    // console.log(user, 'userinTab')


    return (
        <BottomTab.Navigator
            tabBar={(tabsProps) => (
                <>
                    <BottomTabBar {...tabsProps} />
                </>
            )}
            initialRouteName={navigationStrings.HOME}
            screenOptions={{
                headerShown: false,
                // tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'gray',


                tabBarStyle: { backgroundColor: '#333', height: moderateScale(60) },
                tabBarShowLabel: false
            }}
        >
            <BottomTab.Screen
                name={navigationStrings.HOME}
                component={Screens.Home}
                options={{
                    tabBarIcon: ({ focused, size }) => {
                        return (
                            <Check name='earth-outline' size={30} color={focused ? '#fff' : 'gray'} />
                            // <Image style={{}}  source={focused?imagePath.peopleactive:imagePath.people} />
                        );
                    },
                }}
            />
            <BottomTab.Screen
                name={navigationStrings.ALLEVENTS}
                component={Screens.AllEvents}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Icons name='calendar-multiple-check' size={28} color={focused ? '#fff' : 'gray'} />
                        );
                    },
                }}
            />
            <BottomTab.Screen
                name={navigationStrings.HOST_EVENT}
                component={Screens.HostEvent}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <User name='square-plus' size={30} color={focused ? '#fff' : 'gray'} />
                        );
                    },
                }}
            />
            <BottomTab.Screen
                name={navigationStrings.LIVEVENTS}
                component={Screens.LiveEvents}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Wifi name='wifi-tethering' size={28} color={focused ? '#fff' : 'gray'} />
                        );
                    },
                }}
            />
            <BottomTab.Screen
                name={navigationStrings.USER_PROFILE}
                component={Screens.UserProfile}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <>
                                {user?.profilePicture ? <Image source={{ uri: user?.profilePicture }} style={{ height: moderateScale(30), width: moderateScale(30), borderRadius: moderateScale(15) }} />
                                    :
                                    <User name='user' size={25} color={focused ? '#fff' : 'gray'} />
                                }
                            </>
                        );
                    },
                }}
            />

        </BottomTab.Navigator>
    );
};

const styles = StyleSheet.create({
    customBottomtabsStyle: {
        // height: moderateScale(100)
        // backgroundColor: 'red'
    },

});

export default TabRoutes
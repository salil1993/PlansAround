//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { moderateScale, textScale } from '../styles/responsiveSize';
import IconsComment from 'react-native-vector-icons/MaterialCommunityIcons'


// create a component
const ButtonComp = ({
    onPress = () => { },
    text = '',
    style = {},
    leftImg = null,
    textStyle = {},
    isLoading = false,
    midimgPath,
    midImg,
    iconName = '',
    midIcon,
    IconColor,
}) => {
    return (
        <TouchableOpacity
            style={{ ...styles.container, ...style, }}
            onPress={onPress}
        // activeOpacity={0.7}
        >
            {!!leftImg ? <Image source={leftImg} /> : <View />}
            {midImg && <Image source={midimgPath} style={{ marginRight: moderateScale(5) }} />}
            {midIcon && <IconsComment name={iconName} size={25} color={IconColor} style={{ marginRight: moderateScale(10) }} />}
            {isLoading ? <ActivityIndicator size={'small'} color={'white'} /> : <Text style={{ ...styles.textStyle, ...textStyle }}>{text}</Text>}
            <View />
        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        height: moderateScale(50),
        borderRadius: moderateScale(200),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: moderateScale(16)
    },
    textStyle: {
        fontFamily: fontFamily.medium,
        color: '#FFF',
        fontSize: textScale(16),
        fontFamily: 'Roboto',
        fontWeight: '700'
    }
});

//make this component available to the app
export default ButtonComp;

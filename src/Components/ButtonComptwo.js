import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';

// create a component
const ButtonComptwo = ({
    onPress = () => {},
    text = '',
    style = {},
    leftImg = null,
    textStyle = {},
    isLoading = false
}) => {
    return (
        <TouchableOpacity 
        style={{...styles.container, ...style}}
        onPress={onPress}
        activeOpacity={0.7}
        >

        {!!leftImg ? <Image source={leftImg} />: <View/>}  


        {isLoading ? <ActivityIndicator size={'small'} color={'white'} />:<Text style={{...styles.textStyle, ...textStyle}}>{text}</Text>}
        
        <View />
        
        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        // backgroundColor: colors.redColor,
        height: moderateScale(52),
        borderRadius: moderateScale(8),
        alignItems:'center',
        // justifyContent:'space-between',
        flexDirection:'row',
        paddingHorizontal: moderateScale(16),
        marginVertical:moderateScaleVertical(10)
    },
    textStyle: {
        fontFamily:'Roboto',
        color: '#828282',
        fontSize: textScale(16),
        fontWeight:'500',
        marginLeft:moderateScale(10)

    }
});

//make this component available to the app
export default ButtonComptwo;
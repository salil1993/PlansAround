//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Pressable } from 'react-native';
import { moderateScale, moderateScaleVertical, scale, textScale } from '../styles/responsiveSize';

import Iconpaid from 'react-native-vector-icons/MaterialIcons'



// create a component
const TextInputC = ({
    value,
    text,
    placeholder,
    imgsrc,
    imgLeft,
    imgright,
    style = {},
    keyBoardType,
    secureText,
    onPressSecure,
    editable,
    onChangeText = () => { },
    autoFocus,
    multiline,
    numberOfLines,
    onBlur = () => { },
    type,
    isrightIcon,
    iconname,

    ...props
}) => {
    return (
        <View style={{ ...styles.container, ...style }}>
            <View style={[styles.imginput, {
                height: moderateScale(50),
                alignItems: 'center',
                justifyContent: imgright ? 'space-between' : null,
                flexDirection: 'row',
                paddingHorizontal: moderateScale(10),
                backgroundColor: 'white',
                 borderRadius: scale(5),
                  elevation: 3, 
                  ...style
            }]}>
                {imgLeft && <Image source={imgsrc} style={[styles.imgstyling, { marginLeft: moderateScale(5) }]} resizeMode='contain' />}
                <TextInput placeholder={placeholder}
                 placeholderTextColor={'#828282'}
                    style={{ ...style, flex: 1, color: '#333', fontFamily: 'Roboto', fontSize: textScale(16), fontWeight: '500'}}
                    keyboardType={keyBoardType}
                    value={value}
                    secureTextEntry={secureText}
                    onChangeText={onChangeText}
                    editable={editable}
                    autoFocus={autoFocus}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    maxLength={200}
                    onBlur={onBlur}
                    textContentType={type}
                // textAlign='center'

                />

                {imgright && <Pressable onPress={onPressSecure} ><Image source={imgsrc} style={[styles.imgstyling, { marginRight: moderateScale(10), marginTop:moderateScale(10) }]} /></Pressable>}
                {isrightIcon && <Iconpaid name={iconname} size={30} color={'#005BD4'} />}
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {

    },

    imginput: {
        paddingHorizontal: moderateScale(10),
    },
    imgstyling: {
         height: moderateScale(24),
         width: moderateScale(24),
         resizeMode:'contain'
        // // borderRadius: 20,

    },
    textStyling: {
        color: 'white',
        fontSize: textScale(15),
        fontFamily: 'Montserrat-Regular',
        fontWeight: '400'
    }
});

//make this component available to the app
export default TextInputC;

//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Pressable,TouchableOpacity } from 'react-native';
import { moderateScale, moderateScaleVertical, scale, textScale } from '../styles/responsiveSize';

import Iconpaid from 'react-native-vector-icons/MaterialIcons'



// create a component
const TextInputC = ({
    onPress,
    onPressComment,
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
    errorTxt,
    ...props
}) => {
    return (
        <View style={{ ...styles.container, ...style }}>
            <Pressable  onPress={onPress} style={[styles.imginput, {
                height: moderateScale(50),
                alignItems: 'center',
                justifyContent: imgright && 'space-between',
                flexDirection: 'row',
                paddingHorizontal: moderateScale(10),
                borderRadius: scale(10),
                 //elevation: 3, 
                 borderColor:'#D3D3D3',
                 borderWidth:1,
                  ...style
            }]}>
                {imgLeft && <Image source={imgsrc} style={[styles.imgstyling, { marginLeft: moderateScale(5) }]} resizeMode='contain' />}
               { editable?<TextInput 
                placeholder={placeholder}
                 placeholderTextColor={'#828282'}
                    style={{ ...style, flex: 1, color: '#333', fontFamily: 'Roboto', fontSize: textScale(16), }}
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
                />:<View  style={[styles.imginput, {
                     height: moderateScale(50),
                    alignItems: 'center',
                    justifyContent: imgright && 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: moderateScale(10),
                      ...style}]}>
                    <Text style={{color: '#333', fontFamily: 'Roboto', fontSize: textScale(14), fontWeight: '500'}}>{value? value:placeholder}</Text>
                    </View>}
                   
                {imgright && <TouchableOpacity onPress={onPressSecure} ><Image source={imgsrc} style={[styles.imgstyling]} /></TouchableOpacity>}
                {isrightIcon && <TouchableOpacity onPress={onPressComment}> 
                <Iconpaid name={iconname} size={30} color={'#005BD4'} />
                </TouchableOpacity> 
                }
            </Pressable>
            {errorTxt && <Text style={{color: '#FF0000', fontFamily: 'Roboto', fontSize: textScale(14)}}>{errorTxt}</Text>}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
      
    },

    imginput: {
        paddingHorizontal: moderateScale(10),
       flex:1
    },
    imgstyling: {
         height: moderateScale(20),
         width: moderateScale(20),
         resizeMode:'contain'
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

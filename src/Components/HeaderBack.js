
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { moderateScale, textScale } from '../styles/responsiveSize';
import imagePath from '../constants/imagePath';
import { useNavigation } from '@react-navigation/native';
import Iconburger from 'react-native-vector-icons/Ionicons'


// create a component
const HeaderBack = ({
    onPressLeft,
    leftText = '',
    mainText = '',
    isLeftImage = true,
    style = {},
    rightTextStyle = {},
    rightText = '',
    onPressRight = () => { },
    rightImage,
    rightImg,
    maintxtstyle,
    onRightImgClick = () => { },
    onRightIconClick = () => {
    },
}) => {
    const navigation = useNavigation()



    return (
        <View style={{ ...styles.container, ...style }}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {isLeftImage ? <TouchableOpacity
                    style={{ marginRight: moderateScale(10) }}
                    onPress={!!onPressLeft ? onPressLeft : () => navigation.goBack()}
                >
                    <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                </TouchableOpacity> : null}
                <Text style={{ ...styles.textStyle, ...maintxtstyle }}>{mainText}</Text>

                {!!leftText ? <Text style={styles.textStyle} text={leftText} /> : null}

            </View>

            {!!rightText ?
                <TouchableOpacity
                    onPress={onPressRight}
                >
                    <Text style={{ ...styles.textStyle, ...rightTextStyle }}>{rightText}</Text>
                </TouchableOpacity> : null}
            {
                rightImg &&
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={onRightImgClick} style={{ marginHorizontal: moderateScale(10) }}>
                        <Image source={rightImage} style={{}} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onRightIconClick}>
                        <Iconburger name='reorder-three' size={30} color='#4F4F4F' />
                    </TouchableOpacity>
                </View>

            }
            {/* {
                rightIcon &&
                
            } */}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        height: moderateScale(42),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // flex:1
        // paddingHorizontal: moderateScale(16)
    },
    textStyle: {
        fontSize: textScale(16),
        fontFamily: 'Roboto',
        color: '#333',
        fontWeight: '700'


    }
});

//make this component available to the app
export default HeaderBack;
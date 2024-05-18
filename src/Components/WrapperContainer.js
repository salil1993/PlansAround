//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,StatusBar} from 'react-native';
import { moderateScale } from '../styles/responsiveSize';
import { SafeAreaView } from 'react-native-safe-area-context';

// create a component
const WrapperContainer = ({
    style = {},
    children
}) => {

    return (
        <View style={{
            ...styles.container,
            ...style,
            //backgroundColor:"#F2F2F2"
        }}>
            <SafeAreaView style={{flex:1,backgroundColor: '#fff'}}>
            <StatusBar translucent backgroundColor='transparent' barStyle={'dark-content'}/>
                {children}
                </SafeAreaView>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding:moderateScale(16)
    },
});

//make this component available to the app
export default WrapperContainer;

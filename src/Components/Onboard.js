//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import imagePath from '../constants/imagePath';

// create a component
const Onboard = () => {
    return (
        <View>
            <Image source={imagePath.phone}/>
            <Text>Onboard</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
    
    },
});

//make this component available to the app
export default Onboard;

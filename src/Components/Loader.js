//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// create a component
const Loader = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={'large'} color={'#005BD4'} />
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
       // backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
});

//make this component available to the app
export default Loader;

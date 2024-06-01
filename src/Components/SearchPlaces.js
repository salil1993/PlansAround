//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { height, moderateScale, scale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
// create a component
const SearchPlaces = ({
    onSearchPlaces = () => { },
    placeholder = '',


}) => {

    // Geolocation.getCurrentPosition(info => console.log(info));
    return (
        <View style={{
            marginVertical: moderateScaleVertical(5),
            borderRadius: scale(5),
           // elevation: 3, 
            borderColor:'#D3D3D3',
            borderWidth:1,
        }} >
            <GooglePlacesAutocomplete
                onPress={onSearchPlaces}
                query={{
                    key: 'AIzaSyDoIp9EAqQ10AGtqcgNm6TWndqvUgroHJk',
                    language: 'en',
                }}
                placeholder={placeholder}
                textInputProps={{
                    placeholderTextColor: '#828282',
                }}
                fetchDetails={true}
                listViewDisplayed={true}
                disableScroll={true}
                enableHighAccuracyLocation={true}
                enablePoweredByContainer={false}
                minLength={4}
                styles={{
                    // container: { height: 300,},
                    textInput: { color: '#333', backgroundColor: '#fff', borderRadius: scale(5), elevation: 3, height: moderateScale(50) },
                    description: { color: '#005BD4', },
                    listView: {
                        // position: 'absolute', 
                        // top: moderateScaleVertical(55),
                        // bottom:0,
                        backgroundColor: '#FFF',
                       // zIndex: 1
                    }
                }}
                GooglePlacesDetailsQuery={{
                    fields: "geometry",
                }}
                debounce={300}
            // currentLocation={true}
            // currentLocationLabel='Current location'

            />



        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
});

//make this component available to the app
export default SearchPlaces;

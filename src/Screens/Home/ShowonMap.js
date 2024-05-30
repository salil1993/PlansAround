//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScaleVertical, moderateScale, textScale } from '../../styles/responsiveSize';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
// create a component
const ShowonMap = ({ route, navigation }) => {
    const EData = route.params.Elocation;
    const UData = route.params.Ulocation;
    const type = route.params.type;
    return (
        <WrapperContainer>
            <HeaderBack mainText='Event location' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
           { type == 'EventHosting'?<View style={styles.container}>

                {EData && UData ?
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: EData.latitude,
                            longitude: EData.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,

                        }}
                        loadingEnabled={true}
                        loadingIndicatorColor='#005BD4'
                    // moveOnMarkerPress={true}
                    // showsUserLocation={true}
                    // showsMyLocationButton={true}
                    >
                        {/* <Circle
                            // key={event.id}
                            center={{
                                latitude: EData.latitude,
                                longitude: EData.longitude,
                            }}
                            radius={500} // Adjust radius as needed (in meters)
                            strokeWidth={2}
                            strokeColor="rgba(255,0,0,0.5)"
                            fillColor="rgba(255,0,0,0.2)"
                            zIndex={2}
                        /> */}
                        <Marker pinColor = {"purple"}  coordinate={UData} title="Your Location" />
                        <Marker coordinate={EData} title="Event Location" />
                        <MapViewDirections
                            origin={UData}
                            destination={EData}
                            apikey={'AIzaSyDoIp9EAqQ10AGtqcgNm6TWndqvUgroHJk'}
                            strokeWidth={3}
                            strokeColor="#005BD4"
                        />


                        {/* <Polyline
                            coordinates={[UData, EData]}
                            strokeWidth={4}
                            strokeColor="blue"
                        /> */}
                    </MapView>
                    :
                    <Text style={styles.eventtxt}>No Location exists</Text>
                }
            </View>: <View style={styles.container}>

{EData && UData ?
    <MapView
        style={styles.map}
        initialRegion={{
            latitude: EData.latitude,
            longitude: EData.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,

        }}
        loadingEnabled={true}
        loadingIndicatorColor='#005BD4'
    // moveOnMarkerPress={true}
    // showsUserLocation={true}
    // showsMyLocationButton={true}
    >
        <Circle
            // key={event.id}
            center={{
                latitude: EData.latitude,
                longitude: EData.longitude,
            }}
            radius={500} // Adjust radius as needed (in meters)
            strokeWidth={2}
            strokeColor="rgba(255,0,0,0.5)"
            fillColor="rgba(255,0,0,0.2)"
            zIndex={2}
        />
        {/* <Marker pinColor = {"purple"}  coordinate={UData} title="Your Location" />
        <Marker coordinate={EData} title="Event Location" />
        <MapViewDirections
            origin={UData}
            destination={EData}
            apikey={'AIzaSyDoIp9EAqQ10AGtqcgNm6TWndqvUgroHJk'}
            strokeWidth={3}
            strokeColor="#005BD4"
        /> */}


        {/* <Polyline
            coordinates={[UData, EData]}
            strokeWidth={4}
            strokeColor="blue"
        /> */}
    </MapView>
    :
    <Text style={styles.eventtxt}>No Location exists</Text>
}
</View>}

        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#2c3e50',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    eventtxt: {
        color: '#4F4F4F',
        fontSize: textScale(20),
        fontWeight: '500'
    },
});

//make this component available to the app
export default ShowonMap;

//import liraries
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, Image } from 'react-native';
import imagePath from '../../constants/imagePath';
import { moderateScale, scale, height, moderateScaleVertical } from '../../styles/responsiveSize';
import Modal from 'react-native-modal'
import ButtonComp from '../../Components/ButtonComp';
import navigationStrings from '../../Navigation/navigationStrings';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getData } from '../../utils/helperFunctions';
import { useDispatch } from 'react-redux'
import { userCurrentLocation, userStatus } from '../../redux/Slices/UserSlice';


// create a component
const InitialScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    useEffect(() => {

    },
        []);

    return (
        <ImageBackground source={imagePath.Splash} style={styles.backgroundImage}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />
                <View style={{ flex: 1 }}>
                    <View style={styles.logoContainer}>
                        <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Roboto', fontWeight: '800', fontSize: scale(40), color: '#fff' }}>PLANSAROUND</Text>
                            <Text style={{ textAlign: 'center', fontFamily: 'Roboto', fontWeight: '700', fontSize: scale(18), color: '#fff', marginVertical: moderateScaleVertical(20) }}>Socialize… For Real!</Text>
                            <Image source={imagePath.Logo} style={styles.logo} resizeMode='contain' />
                        </View>
                        <View style={{ flex: 0.4, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={styles.Initialtext}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco</Text>
                        </View>
                    </View>
                    <View>
                        <Modal
                            coverScreen={false}
                            isVisible={true}
                            style={{ justifyContent: 'flex-end', }}
                        >
                            <View style={styles.modalStyle}>
                                <View>
                                    <ButtonComp text='Let’s get started' style={{ backgroundColor: '#005BD4' }} onPress={() => navigation.navigate(navigationStrings.PHONE_NUMBERINPUT)} />
                                </View>
                                <View style={{ marginVertical: moderateScaleVertical(10) }}>
                                    <ButtonComp text='Sign in' style={{ borderColor: '#005BD4', borderWidth: 2 }} onPress={() => navigation.navigate(navigationStrings.LOG_IN)} />
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={styles.contactText}>Have Trouble?</Text>
                                    <Text style={styles.contactText2}>Contact Us</Text>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        // opacity:0.8
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        padding: scale(20)
    },
    logo: {
        height: moderateScale(150),
        width: moderateScale(150),
        // alignSelf: 'center',
        // marginBottom:moderateScaleVertical(50)
    },
    Initialtext: {
        fontSize: scale(14),
        fontWeight: '600',
        fontFamily: 'Roboto',
        textAlign: 'center',
        color: '#FFF',
        marginBottom: moderateScaleVertical(100)

    },
    modalStyle: {
        backgroundColor: 'black',
        minHeight: moderateScale(height / 3.5),
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: moderateScale(16)
    },
    contactText: {
        color: '#F2F2F2',
        fontSize: scale(14),
        fontFamily: 'Roboto',
        fontWeight: '400',
    },
    contactText2: {
        color: '#F2F2F2',
        fontSize: scale(14),
        fontFamily: 'Roboto',
        fontWeight: '700',
        textDecorationLine: 'underline',
        marginLeft: moderateScale(5)
    }

});

//make this component available to the app
export default InitialScreen;

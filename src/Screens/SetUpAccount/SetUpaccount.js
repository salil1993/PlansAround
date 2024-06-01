//import liraries
import React, { Component, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert,TouchableWithoutFeedback,Keyboard } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import ButtonComptwo from '../../Components/ButtonComptwo';
import TextInputC from '../../Components/TextInputC';
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


// create a component
const SetUpaccount = () => {
    const [Information, setInformation] = useState(false);
    const [TC, setTC] = useState(false);
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [SecureText, setSecureText] = useState(false);

    const handleSubmit=()=>{
        console.log(Information)
        console.log(TC)
        console.log(Email)
        console.log(Password)
    }
    const onPressSecure=()=>{
setSecureText(!SecureText)
    }


    return (
        <WrapperContainer>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <SafeAreaView style={styles.container}>
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    <View style={styles.helpIcon}>
                        <Image source={imagePath.help_outline} />
                    </View>
                    <View style={{}}>
                        <Image source={imagePath.Acc} style={{ alignSelf: 'center', height: scale(96), width: scale(96) }} />
                        <Text style={styles.phoneHeading}>Set up your account</Text>
                        <Text style={styles.phoneHeading2}>Lorem ipsum dolor sit amet, consect etur adi piscing </Text>
                        <View>
                            <ButtonComptwo text='Sign up with Google' leftImg={imagePath.google} style={{ backgroundColor: 'white', elevation: 3 }} />
                            <ButtonComptwo text='Sign up with Faceboook' leftImg={imagePath.fb} style={{ backgroundColor: 'white', elevation: 3 }} />
                        </View>
                        <View>
                            <Text style={styles.or}>or</Text>
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(10) }}>
                            <TextInputC placeholder={'Email id'}
                            value={Email}
                            onChangeText={(text)=>setEmail(text)}
                            keyBoardType='email-address'
                            />
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(10) }}>
                            <TextInputC
                             placeholder={'Password'} 
                             imgright={true} 
                             imgsrc={!SecureText? imagePath.eye:imagePath.eyeoff}
                             value={Password}
                             onChangeText={(text)=>setPassword(text)}
                            secureText={SecureText}
                            onPressSecure={onPressSecure}
                            keyBoardType='ascii-capable'
                             />
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(10) }}>
                            <BouncyCheckbox
                                size={25}
                                disableBuiltInState
                                isChecked={Information}
                                onPress={() => setInformation(!Information)}
                                unfillColor="#FFFFFF"
                                fillColor='#005BD4'
                                text="All the information above is accurate"
                                innerIconStyle={{
                                    borderRadius: 2,
                                    borderWidth: 1,
                                    borderColor: '#D9D9D9',
                                    backgroundColor: Information ? "#005BD4" : 'white' // to make it a little round increase the value accordingly
                                }}
                                textStyle={{
                                    textDecorationLine: "none",
                                    color: '#4F4F4F',
                                    fontSize: scale(14),
                                    fontWeight: '400',
                                    fontFamily: 'Roboto'
                                }}
                            />
                        </View>
                        <View>
                            <BouncyCheckbox
                                size={25}
                                disableBuiltInState
                                isChecked={TC}
                                onPress={() => setTC(!TC)}
                                unfillColor="#FFFFFF"
                                fillColor='#005BD4'
                                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. I agree to the Terms of use and Conditions apply."
                                innerIconStyle={{
                                    borderRadius: 2,
                                    borderWidth: 1,
                                    borderColor: '#D9D9D9',
                                    backgroundColor: TC ? "#005BD4" : 'white' // to make it a little round increase the value accordingly
                                }}
                                textStyle={{
                                    textDecorationLine: "none",
                                    color: '#4F4F4F',
                                    fontSize: scale(14),
                                    fontWeight: '400',
                                    fontFamily: 'Roboto'
                                }}
                            />
                        </View>
                        <View style={{ marginTop: moderateScaleVertical(20), justifyContent: 'flex-end' }}>
                            <ButtonComp onPress={handleSubmit} text='Submit' style={{ backgroundColor: '#828282' }} />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
            </TouchableWithoutFeedback>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(16)
    },
    helpIcon: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    phoneHeading: {
        fontSize: scale(24),
        fontFamily: 'Roboto',
        fontWeight: '800',
        color: '#333',
        marginVertical: moderateScaleVertical(10)
    },
    phoneHeading2: {
        fontSize: scale(14),
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: '#4F4F4F',
        marginVertical: moderateScaleVertical(10)

    },
    contactText: {
        color: '#4F4F4F',
        fontSize: scale(14),
        fontFamily: 'Roboto',
        fontWeight: '400',
    },
    contactText2: {
        color: '#333',
        fontSize: scale(14),
        fontFamily: 'Roboto',
        fontWeight: '700',
        textDecorationLine: 'underline',
        marginLeft: moderateScale(5)
    },
    textInputContainer: {
        // height:scale(42),
        // width:scale(18),
        borderBottomColor: 'red'
    },
    roundedTextInput: {
        backgroundColor: 'white',
        borderRadius: moderateScale(5),
        height: moderateScale(52)
    },
    or: {
        textAlign: 'center',
        color: '#4F4F4F',
        fontFamily: 'Roboto',
        fontSize: scale(16),
        fontWeight: '500',
        marginVertical: moderateScaleVertical(10)
    }

});

//make this component available to the app
export default SetUpaccount;

//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Keyboard, KeyboardAvoidingView, Image, TextInputComponent, Alert } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import ButtonComp from '../../Components/ButtonComp';
import { scale, moderateScale, moderateScaleVertical } from '../../styles/responsiveSize';
import ButtonComptwo from '../../Components/ButtonComptwo';
import TextInputC from '../../Components/TextInputC';
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getData, storeData } from '../../utils/helperFunctions';
import { useDispatch } from 'react-redux/es/exports';
import { saveUserData, userStatus } from '../../redux/Slices/UserSlice';
import Snackbar from 'react-native-snackbar';
import navigationStrings from '../../Navigation/navigationStrings';
import { Login } from '../../API/Api';
import appleAuth, {
    AppleButton,
} from '@invertase/react-native-apple-authentication';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
// create a component
const LogIN = ({ navigation }) => {
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(false);
    const [ProfileShow, setProfileShow] = useState(false)
    const [email, setemail] = useState('')
    const [Password, setPassword] = useState('')
    const [visible, setvisible] = useState(false)
    const handleSubmit = () => {
        setLoading(true);
        console.log(email)
        console.log(Password)
        Login(email.trim(), Password.trim())
            .then((res) => {
                console.log(res)
                console.log(res.token)
                setLoading(false)
                storeData('UserToken', res.token);
                Snackbar.show({
                    text: `${res.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });
                setTimeout(() => {
                    dispatch(userStatus(true))
                    dispatch(saveUserData(res.user))
                    console.log('Data gya')
                    Snackbar.dismiss();
                    // navigation.navigate(navigationStrings.TABROUTES)
                    // navigation.navigate(navigationStrings.EMAIL_VERIFY)
                }, 1000)


            })
            .catch((res) => {
                console.log(res)
                setLoading(false);
                Snackbar.show({
                    text: `${res.response.data.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    textColor: "#fff",
                });
            })



    }

    async function handleGoogleSignIn() {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.error('userInfo sign-in RES:', userInfo);
            // handleLoginApi(
            //     userInfo.user.name,
            //     userInfo.user.email,
            //     userInfo.serverAuthCode,
            //     'Google',
            //     userInfo.user.photo,
            // );

            // You're now signed in with Google!
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    }

    const handleAppleLogin = async () => {
        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
            });
            console.log('RES---', appleAuthRequestResponse);
            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
            console.log(
                'credentialState===',
                credentialState,
                appleAuthRequestResponse.email,
            );
            // use credentialState response to ensure the user is authenticated
            if (credentialState === appleAuth.State.AUTHORIZED) {
                if (appleAuthRequestResponse.email) {
                    const data = {
                        name: `${appleAuthRequestResponse.fullName.givenName} ${appleAuthRequestResponse.fullName.familyName}`,
                        email: appleAuthRequestResponse.email,
                        providerId: appleAuthRequestResponse.user,
                    };
                } else {
                }
            } else {
            }
        } catch (error) {
            Alert.alert('PlansAround', 'Failed to login with Apple');
            console.error(error);
        }
    };

    return (
        <WrapperContainer>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAwareScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={styles.helpIcon}>
                            <Image source={imagePath.help_outline} />
                        </View>
                        <View style={{ flex: 0.5, justifyContent: 'flex-start' }}>
                            <Image source={imagePath.Login} style={{ alignSelf: 'center', height: scale(96), width: scale(96) }} />
                            <Text style={styles.phoneHeading}>Sign In</Text>
                            <Text style={[styles.phoneHeading2, { marginVertical: moderateScaleVertical(15) }]}>Lorem ipsum dolor sit amet, consect etur adi piscing </Text>
                            <View style={{ marginVertical: moderateScaleVertical(15), }}>
                                <ButtonComptwo text='Sign in with Google'
                                    style={{
                                        backgroundColor: '#fff',
                                        elevation: 3,
                                        height: 56,
                                        borderColor: 'grey',
                                        borderWidth: 1
                                    }} leftImg={imagePath.google} onPress={() => handleGoogleSignIn()} />
                                {Platform.OS == 'ios' && (
                                    <AppleButton
                                        buttonText={"Sign in with Apple"}
                                        buttonStyle={AppleButton.Style.WHITE_OUTLINE}
                                        buttonType={AppleButton.Type.SIGN_IN}
                                        onPress={handleAppleLogin}
                                        style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            height: 56,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    />
                                )}
                                {/* <ButtonComptwo text='Sign in with Facebook' style={{ backgroundColor: '#fff', elevation: 3 }} leftImg={imagePath.fb} /> */}
                                <Text style={{ color: '#4F4F4F', fontSize: scale(14), textAlign: 'center', fontFamily: 'Roboto', fontWeight: '500', marginVertical: moderateScaleVertical(10) }}>or</Text>
                                <TextInputC placeholder={'Email'} value={email} onChangeText={(text) => setemail(text)} />
                                <TextInputC placeholder={'Password'} value={Password} onChangeText={(text) => setPassword(text)} style={{ marginTop: moderateScaleVertical(10), alignItems: 'center' }} imgright={true} imgsrc={visible ? imagePath.eyeoff : imagePath.eye} onPressSecure={() => setvisible(!visible)} secureText={visible} />
                            </View>
                            {/* <View style={{ marginVertical: moderateScaleVertical(5), }}>
                                <BouncyCheckbox
                                    size={20}
                                    disableBuiltInState
                                    isChecked={ProfileShow}
                                    onPress={() => setProfileShow(!ProfileShow)}
                                    unfillColor="#FFFFFF"
                                    fillColor='#005BD4'
                                    text="All the information above is accurate"
                                    innerIconStyle={{
                                        borderRadius: 2,
                                        borderWidth: 1,
                                        borderColor: 'white',
                                        backgroundColor: ProfileShow ? "#005BD4" : 'white' // to make it a little round increase the value accordingly
                                    }}
                                    textStyle={{
                                        textDecorationLine: "none",
                                        color: '#4F4F4F',
                                        fontSize: scale(14),
                                        fontWeight: '400',
                                        fontFamily: 'Roboto'
                                    }}
                                />
                            </View> */}
                            <ButtonComp onPress={handleSubmit} isLoading={Loading} text='Submit' style={{ backgroundColor: '#005BD4', marginVertical: moderateScaleVertical(10) }} />
                        </View>
                        <View style={{
                            flex: 0.4,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            // marginBottom:moderateScale(10)
                        }}>
                            <Text style={styles.contactText}>New User?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate(navigationStrings.PHONE_NUMBERINPUT)}>
                                <Text style={styles.contactText2}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(12)
    },
    helpIcon: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    phoneHeading: {
        fontSize: scale(24),
        fontFamily: 'Roboto',
        fontWeight: '800',
        color: '#333'
    },
    phoneHeading2: {
        fontSize: scale(14),
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: '#4F4F4F'
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
    }
});

//make this component available to the app
export default LogIN;

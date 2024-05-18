//import liraries
import React, { Component, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, TouchableWithoutFeedback,TouchableOpacity, Keyboard } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import OTPTextView from 'react-native-otp-textinput';
import navigationStrings from '../../Navigation/navigationStrings';
import { EmailOtpverify } from '../../API/Api';
import OtpInput from '../OtpInput/OtpInput';
import Snackbar from 'react-native-snackbar';
// create a component
const OtpEmail = ({ navigation, route }) => {
    const email = route.params.data;
    const [otpInput, setOtpInput] = useState("");
    const [timer, setTimer] = useState(5);
    const [bgColor,setbgColor]=useState(false)
    const [Loading, setLoading] = useState(false);

    const input = useRef(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (timer > 0) setTimer(timer - 1)
        }, 1000);
        return () => {
            if (timeout) {
                clearTimeout(timeout)
            }
        }
    }, [timer])

    const handleCellTextChange = (text, i) => {
        setbgColor(true)
        console.log(text,'txt')
        console.log(otpInput);
        if (text === 5) {
            Keyboard.dismiss();
        }

    };
    const onResendCode = () => {
        setTimer(5)

    }
    const handleVerify = () => {
        Keyboard.dismiss();
        setLoading(true)
        console.log(otpInput)
        EmailOtpverify(otpInput)
        .then((res) => {
            console.log(res)
            setLoading(false)
            Snackbar.show({
                text: `${res.message}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#005BD4',
                textColor: "#fff",
            });
            // setTimeout(() => {
            //     Snackbar.dismiss();
        navigation.navigate(navigationStrings.BASIC_INFO)
            // }, 2000)
        })
        .catch((err) => {
            console.log(err)
            setLoading(false)
            Snackbar.show({
                text: `${err.response.data.message}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        })



    }
    return (
        <WrapperContainer>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                        <View style={{ flex: 1 }}>

                        <View style={[styles.helpIcon, { justifyContent: 'space-between' }]}>
                            <TouchableOpacity
                                style={{ marginRight: moderateScale(10) }}
                                onPress={() => navigation.goBack()}>
                                <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                            </TouchableOpacity>
                            <Image source={imagePath.help_outline} />
                        </View>

                            <View style={{ flex: 0.7, justifyContent: 'flex-start' }}>
                                <Image source={imagePath.emailverify} style={{ alignSelf: 'center', height: scale(96), width: scale(96) }} />
                                <Text style={styles.phoneHeading}>2 Factor Authentication</Text>
                                <Text style={styles.phoneHeading2}>A verification code has been sent to your email id <Text style={{ color: '#005BD4', fontSize: moderateScale(15) }}>{email}</Text>  Enter the code below to complete 2 Factor Authentication.</Text>
                                <View>
                                    <OTPTextView
                                        ref={input}
                                        containerStyle={styles.textInputContainer}
                                        textInputStyle={styles.roundedTextInput}
                                        handleTextChange={setOtpInput}
                                        handleCellTextChange={handleCellTextChange}
                                        inputCount={6}
                                        keyboardType="numeric"
                                        autoFocus
                                        tintColor={'#333'}
                                    />
                                </View>
                                <ButtonComp text='Verify' onPress={handleVerify} style={{
                                    backgroundColor: bgColor ?'#005BD4':'#828282',
                                    marginVertical: moderateScaleVertical(20)
                                }}
                                isLoading={Loading}
                                />
                            </View>


                            <View style={{
                                flex: 0.3,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                marginTop: moderateScaleVertical(300)

                            }}>
                                <Text style={styles.contactText}>Didn’t get a code?</Text>
                                {timer > 0 ? <Text style={styles.contactText2}>Resend Code in {timer}</Text> :
                                    <Text onPress={onResendCode} style={styles.contactText2}>Resend Code</Text>}
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
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
        color: '#4F4F4F',
        marginVertical: moderateScaleVertical(20)
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
        flex: 1,
        backgroundColor: 'white',
        borderRadius: moderateScale(5),
        height: moderateScale(52)

    },

});

//make this component available to the app
export default OtpEmail;

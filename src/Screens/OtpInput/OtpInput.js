//import liraries
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback,TouchableOpacity, Keyboard } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import OTPTextView from 'react-native-otp-textinput';
import navigationStrings from '../../Navigation/navigationStrings';
import Snackbar from "react-native-snackbar"
import { MobileOTPVERIFY } from '../../API/Api';
import { storeData } from '../../utils/helperFunctions';


// create a component
const OtpInput = ({ navigation, route }) => {
    const number = route.params.data;
    const [otpInput, setOtpInput] = useState("");
    const [timer, setTimer] = useState(60);
    const [btnColor, setBtnColor] = useState(true)
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
        setBtnColor(false);
        if (text === 5) {
            Keyboard.dismiss();
        }

    };

    const handleClick = () => {
        console.log(otpInput);
        // setLoading(true)
        // if (otpInput == 123456) {
        //     setLoading(false);
        //     Snackbar.show({
        //         text: `${'OTP Verified successful!!'}`,
        //         duration: Snackbar.LENGTH_SHORT,
        //         backgroundColor: '#005BD4',
        //         textColor: "#fff",
        //     });
        //     setTimeout(() => {
        //         Snackbar.dismiss();
        //         // navigation.navigate(navigationStrings.BASIC_INFO)
        //     }, 2000)
        // } else {
        //     setLoading(false);
        //     Snackbar.show({
        //         text: `${'OTP Invalid'}`,
        //         duration: Snackbar.LENGTH_SHORT,
        //         backgroundColor: 'red',
        //         textColor: "#fff",
        //     });

        // }
        setLoading(true)
        MobileOTPVERIFY(number,otpInput)
        .then((res)=>{console.log(res)
            console.log(res.token);
           storeData('UserToken',res.token);
           setLoading(false)
            Snackbar.show({
                text: `${res.message}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor:'#005BD4',
                textColor:"#fff",
              });
            //   setTimeout(()=>{
            //     Snackbar.dismiss();
                navigation.navigate(navigationStrings.REGISTER)
        // navigation.navigate(navigationStrings.EMAIL_VERIFY)
            //   },2000)
        })
        .catch((err)=>{console.log(err)
            setLoading(false)
            Snackbar.show({
                text: `${err.response.data.message}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor:'red',
                textColor:"#fff",
              });
        })



    }
    const onResendCode = () => {
        setTimer(5)
    }

    return (
        <WrapperContainer>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                    <View style={[styles.helpIcon,{justifyContent:'space-between',}]}>
                            <TouchableOpacity
                                style={{ marginRight: moderateScale(10) }}
                                onPress={() => navigation.goBack()}>
                                <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                            </TouchableOpacity>
                            <Image source={imagePath.help_outline} />
                        </View>
                        <View style={{ flex: 0.5, justifyContent: 'flex-start', }}>
                            <Image source={imagePath.shield} style={{ alignSelf: 'center', height: scale(96), width: scale(96) }} />
                            <Text style={[styles.phoneHeading, { marginVertical: moderateScaleVertical(10) }]}>Enter verification code</Text>
                            <Text style={styles.phoneHeading2}>Enter the 6 digit verification code sent to your phone number.</Text>
                            <View style={{ marginVertical: moderateScaleVertical(10) }}>
                                <OTPTextView
                                    ref={input}
                                    containerStyle={styles.textInputContainer}
                                    textInputStyle={styles.roundedTextInput}
                                    handleTextChange={setOtpInput}
                                    handleCellTextChange={(item, index) => handleCellTextChange(index)}
                                    inputCount={6}
                                    keyboardType="numeric"
                                    autoFocus
                                    tintColor={'#333'}

                                />
                            </View>
                            <ButtonComp isLoading={Loading} text='Verify' style={{ backgroundColor: btnColor ? '#828282' : '#005BD4', marginVertical: moderateScaleVertical(10) }} onPress={handleClick} />
                        </View>

                        <View style={{
                            flex: 0.4,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                        }}>
                            <Text style={styles.contactText}>Didn’t get a code?</Text>
                            {timer > 0 ? <Text style={styles.contactText2}>Resend Code in {timer}</Text> :
                                <Text onPress={onResendCode} style={styles.contactText2}>Resend Code</Text>}
                        </View>
                    </View>
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
        height: moderateScale(50),
    },

});

//make this component available to the app
export default OtpInput;

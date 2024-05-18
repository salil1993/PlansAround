//import liraries
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import PhoneInput from 'react-native-phone-number-input';
import navigationStrings from '../../Navigation/navigationStrings';
import { MobileOTP } from '../../API/Api';
import Snackbar from "react-native-snackbar"
import { validatePhoneNumber } from '../../utils/helperFunctions';



// create a component
const PhoneNumberInput = ({ navigation }) => {
    const phoneInput = useRef(null);
    const [phoneNumber, setphoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [formattedValue, setFormattedValue] = useState("");
    const [Loading, setLoading] = useState(false);





    const handlPhoneInput = () => {
        console.log(phoneNumber.length);
        if (phoneNumber.length > 10 || phoneNumber.length < 10) {
            Snackbar.show({
                text: `${'Please enter 10 digit number'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
            return;
        }

        setLoading(true);
        MobileOTP(phoneNumber, countryCode)
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
                // Snackbar.dismiss();
                navigation.navigate(navigationStrings.OTP_INPUT, { data: phoneNumber })
                // }, 2000)
            })
            .catch((err) => {
                console.log(err.response.data.message)
                setLoading(false);
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
                        <View style={[styles.helpIcon, { justifyContent: 'space-between' }]}>
                            <TouchableOpacity
                                style={{ marginRight: moderateScale(10) }}
                                onPress={() => navigation.goBack()}>
                                <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                            </TouchableOpacity>
                            <Image source={imagePath.help_outline} />
                        </View>
                        <View style={{ flex: 0.5, justifyContent: 'flex-start' }}>
                            <Image source={imagePath.phone} style={{ alignSelf: 'center', height: scale(96), width: scale(96) }} />
                            <Text style={styles.phoneHeading}>What’s your phone number?</Text>
                            <Text style={[styles.phoneHeading2, { marginVertical: moderateScaleVertical(15) }]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</Text>
                            <View style={{ marginVertical: moderateScaleVertical(15), }}>
                                <PhoneInput
                                    defaultValue={phoneNumber}
                                    ref={phoneInput}
                                    defaultCode={'IT'}
                                    layout="first"
                                    placeholder=' '
                                    withShadow
                                    autoFocus
                                    onChangeText={(text) => {
                                        setphoneNumber(text);

                                    }}
                                    onChangeFormattedText={(text) => {
                                        setFormattedValue(text);
                                        setCountryCode(phoneInput.current?.getCallingCode() || '');
                                    }}
                                    codeTextStyle={{ backgroundColor: '#fff' }}
                                    containerStyle={{ shadowOpacity: 4, width: '100%', height: scale(50), borderRadius: moderateScale(5) }}
                                    textInputStyle={{ color: '#333', height: scale(50), fontFamily: 'Roboto', fontWeight: '700', fontSize: scale(16), backgroundColor: '#fff' }}
                                />
                            </View>
                            <ButtonComp isLoading={Loading} onPress={handlPhoneInput} text='Send code' style={{ backgroundColor: phoneNumber ? '#005BD4' : '#828282', marginVertical: moderateScaleVertical(10) }} />
                        </View>
                        <View style={{
                            flex: 0.4,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            // marginBottom:moderateScale(10)
                        }}>
                            <Text style={styles.contactText}>Have trouble?</Text>
                            <Text style={styles.contactText2}>Contact Us</Text>
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
export default PhoneNumberInput;

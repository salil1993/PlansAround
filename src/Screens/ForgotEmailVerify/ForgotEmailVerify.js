//import liraries
import React, { useState , useEffect, useRef} from 'react';
import { View, Text, StyleSheet, Keyboard, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import HeaderBack from '../../Components/HeaderBack';
import ButtonComp from '../../Components/ButtonComp';
import WrapperContainer from '../../Components/WrapperContainer';
import TextInputC from '../../Components/TextInputC';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { VerifyForgotPass } from '../../API/Api';
import Snackbar from 'react-native-snackbar';
import navigationStrings from '../../Navigation/navigationStrings';
import OTPTextView from 'react-native-otp-textinput';
// create a component
const ForgotEmailVerify = ({route,navigation}) => {
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(false);
    const [Password, setPassword] = useState('')
    const [otpInput, setOtpInput] = useState("");
    const [timer, setTimer] = useState(5);
    const [bgColor,setbgColor]=useState(false)
    const [visible, setvisible] = useState(false)

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

    const handleSubmit = () =>{
        setLoading(true);
        console.log(route.params.email)
        VerifyForgotPass(route.params.email, otpInput, Password)
            .then((res) => {
                setLoading(false);
                Snackbar.show({
                    text: `${res?.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });
                navigation.navigate(navigationStrings.LOG_IN)
            })
            .catch((err) => {
                console.log('Errormsg', err)
                setLoading(false);
                Snackbar.show({
                    text: `${err?.response?.data?.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    textColor: "#fff",
                });
            })

    }

    const handleCellTextChange = (text, i) => {
        setbgColor(true)
        console.log(text,'txt')
        console.log(otpInput);
        if (text === 5) {
            Keyboard.dismiss();
        }

    };

    return (
        <WrapperContainer>
            <View style={styles.container}>
                <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
                <HeaderBack mainText='Verify Email' isLeftImage={true} />
                <KeyboardAwareScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Image source={imagePath.Login} style={{ alignSelf: 'center', height: scale(96), width: scale(96) }} />
                     <Text style={styles.phoneHeading}>Verify your Email</Text>
                    <Text style={[styles.phoneHeading2, { marginVertical: moderateScaleVertical(15) }]}>{route.params.email}</Text>
                <View style={{ marginVertical: moderateScaleVertical(15) }}>
                <Text style={[styles.phoneHeading2, { marginVertical: moderateScaleVertical(15) }]}>{'Enter Otp'}</Text>
                                   
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
                                <View style={{ marginVertical: moderateScale(10) }}>
                                <Text style={[styles.phoneHeading2, { marginVertical: moderateScaleVertical(15) }]}>{'Enter Password'}</Text>
                                <TextInputC editable={true} placeholder={'Password'} value={Password} onChangeText={(text) => setPassword(text)} style={{ alignItems: 'center' }} imgright={true} imgsrc={visible ? imagePath.eyeoff : imagePath.eye} onPressSecure={() => setvisible(!visible)} secureText={visible} />
             </View>
             <ButtonComp  onPress={handleSubmit} 
             isLoading={Loading}
              text='Submit' 
              style={{ backgroundColor: bgColor ?'#005BD4':'#828282', marginVertical: moderateScaleVertical(80) }} />
             </KeyboardAwareScrollView>
            </View>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: moderateScale(12)
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
   
});

//make this component available to the app
export default ForgotEmailVerify;

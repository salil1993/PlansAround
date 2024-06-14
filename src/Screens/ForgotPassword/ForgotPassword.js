//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import HeaderBack from '../../Components/HeaderBack';
import ButtonComp from '../../Components/ButtonComp';
import WrapperContainer from '../../Components/WrapperContainer';
import TextInputC from '../../Components/TextInputC';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ForgotPasswordApi } from '../../API/Api';
import Snackbar from 'react-native-snackbar';
import navigationStrings from '../../Navigation/navigationStrings';
// create a component
const ForgotPassword = () => {
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(false);
    const [email, setemail] = useState('')

    const handleSubmit = () =>{
        setLoading(true);
        console.log(email)
        ForgotPasswordApi(email.trim())
            .then((res) => {
                navigation.navigate(navigationStrings.EMAIL_VERIFY)
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

    return (
        <WrapperContainer>
            <View style={styles.container}>
                <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
                <HeaderBack mainText='' isLeftImage={true} />
                <KeyboardAwareScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Image source={imagePath.Login} style={{ alignSelf: 'center', height: scale(96), width: scale(96) }} />
                            <Text style={styles.phoneHeading}>Forgot Password</Text>
                            <Text style={[styles.phoneHeading2, { marginVertical: moderateScaleVertical(15) }]}>Lorem ipsum dolor sit amet, consect etur adi piscing </Text>
                <View style={{ marginVertical: moderateScaleVertical(15) }}>
                <TextInputC editable={true} placeholder={'Email'} value={email} onChangeText={(text) => setemail(text)} />
             </View>
             <ButtonComp onPress={handleSubmit} isLoading={Loading} text='Submit' style={{ backgroundColor: '#005BD4', marginVertical: moderateScaleVertical(30) }} />
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
export default ForgotPassword;

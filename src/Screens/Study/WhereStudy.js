//import liraries
import React, { Component, useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, Pressable,
    Platform, KeyboardAvoidingView, Alert, TouchableWithoutFeedback,
    Keyboard, TouchableOpacity
} from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import TextInputC from '../../Components/TextInputC';
import navigationStrings from '../../Navigation/navigationStrings';
import { getUniversity } from '../../API/Api';
import Snackbar from 'react-native-snackbar';
import { useDispatch } from 'react-redux';
import { saveUserData } from '../../redux/Slices/UserSlice';




// create a component
const WhereStudy = ({ navigation, route }) => {
    const dispatch = useDispatch();

    const [College, setCollege] = useState('')
    const [Degree, setDegree] = useState('')
    const [ProfileShow, setProfileShow] = useState(false)
    const [Loading, setLoading] = useState(false);


    const handleSumbit = () => {
        if (College && Degree) {
            setLoading(true)
            getUniversity(College, Degree, ProfileShow).then((res) => {
                console.log(res, 'education');
                const data = res.user;
                dispatch(saveUserData(data));
                setLoading(false);
                Snackbar.show({
                    text: `${res.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });
                // setTimeout(() => {
                Snackbar.dismiss();
                if(route?.params?.isFrom == 'Main'){
                    navigation.navigate(navigationStrings.WHAT_DO,{isFrom:'Main'})
                  }else{
                   navigation.navigate(navigationStrings.WHAT_DO,{isFrom:'Auth'})
                }
              //  navigation.navigate(navigationStrings.WHAT_DO)
                // }, 2000)
            })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    Snackbar.show({
                        text: `${error.message}`,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red',
                        textColor: "#fff",
                    });
                });

        } else {
            Snackbar.show({
                text: `${'Please Enter Name of College and Degree'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }


    }
    return (
        <WrapperContainer>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={[styles.helpIcon, { justifyContent: 'space-between', }]}>
                                <TouchableOpacity
                                    style={{ marginRight: moderateScale(10) }}
                                    onPress={() => navigation.goBack()}>
                                    <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                                </TouchableOpacity>
                                <Image source={imagePath.help_outline} />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                                <Image source={imagePath.study} style={{ alignSelf: 'center', height: scale(110), width: scale(110) }} />
                                <Text style={styles.phoneHeading}>Where did you study?</Text>
                                <Text style={[styles.phoneHeading2, { marginVertical: moderateScaleVertical(20) }]}>Lorem ipsum dolor sit amet, consect etur adi piscing elit, sed do eiusmod tempor incididunt.</Text>
                                <View style={{marginVertical: moderateScaleVertical(10)}}>
                                    <TextInputC 
                                    editable={true}
                                    style={{ height: 50 }}
                                    placeholder={'Name of University/Institute'}
                                        value={College}
                                        onChangeText={(text) => setCollege(text)}
                                    />
                                </View>
                                <View style={{ marginVertical: moderateScaleVertical(15) }}>
                                    <TextInputC 
                                    placeholder={'Degree'}
                                      editable={true}
                                        value={Degree}
                                        style={{ height: 50 }}
                                        onChangeText={(text) => setDegree(text)}
                                    />
                                </View>
                                <View style={{ marginVertical: moderateScaleVertical(10), }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disableBuiltInState
                                        isChecked={ProfileShow}
                                        onPress={() => setProfileShow(!ProfileShow)}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Show on your profile"
                                        innerIconStyle={{
                                            borderRadius: 2,
                                            borderWidth: 1,
                                            borderColor: '#D9D9D9',
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
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 0.3, alignItems: 'center' }}>
                                        <Pressable
                                            android_ripple={{ color: 'red', borderless: true, radius: moderateScale(25), }}
                                            onPress={() => {
                                                if(route?.params?.isFrom == 'Main'){
                                                    navigation.navigate(navigationStrings.WHAT_DO,{isFrom:'Main'})
                                                  }else{
                                                   navigation.navigate(navigationStrings.WHAT_DO,{isFrom:'Auth'})
                                                }
                                            }}>
                                            <Text style={styles.skip}>Skip</Text>
                                        </Pressable>
                                    </View>
                                    <View style={{ flex: 0.7 }}>
                                        <ButtonComp isLoading={Loading} onPress={handleSumbit} text='Submit' style={{ backgroundColor: '#005BD4' }} />
                                    </View>
                                </View>
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
    description: {
        color: '#4F4F4F',
        fontFamily: 'Roboto',
        fontSize: scale(13),
        fontWeight: '700'
    },
    skip: {
        color: '#4F4F4F',
        fontSize: scale(16),
        fontFamily: 'Roboto',
        fontWeight: '600',
    }
});

//make this component available to the app
export default WhereStudy;

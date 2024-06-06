//import liraries
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Image,
    TouchableWithoutFeedback, Keyboard, Pressable, TouchableOpacity,
} from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import TextInputC from '../../Components/TextInputC';
import navigationStrings from '../../Navigation/navigationStrings';
import { getBio } from '../../API/Api';
import Snackbar from 'react-native-snackbar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { saveUserData } from '../../redux/Slices/UserSlice';





// create a component
const WriteBio = ({ navigation, route }) => {
    const dispatch = useDispatch();

    const [Title, setTitle] = useState('')
    const [Description, setDescription] = useState('')
    const [Length, setLength] = useState(0)
    const [Loading, setLoading] = useState(false);


    const handleSumbit = () => {
        if (Description) {
            setLoading(true)
            getBio("Title", Description).then((res) => {
                console.log(res, 'title');
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
                //     Snackbar.dismiss();
                console.log('Params4-->>',route?.params?.isFrom)
                if(route?.params?.isFrom == 'Main'){
                    navigation.navigate(navigationStrings.WHERE_STUDY,{isFrom:'Main'})
                  }else{
                   navigation.navigate(navigationStrings.WHERE_STUDY,{isFrom:'Auth'})
                }
               // navigation.navigate(navigationStrings.WHERE_STUDY)
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
                text: `${'Please Enter Description'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }


        // navigation.navigate(navigationStrings.WHERE_STUDY)
    }
    return (
        <WrapperContainer>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={{ flex: 1 }}>
                            <View style={[styles.helpIcon, { justifyContent: 'space-between', }]}>
                                <TouchableOpacity
                                    style={{ marginRight: moderateScale(10) }}
                                    onPress={() => navigation.goBack()}>
                                    <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                                </TouchableOpacity>
                                <Image source={imagePath.help_outline} />
                            </View>
                            <View style={{ flex: 0.9, justifyContent: 'flex-start' }}>
                                <Image source={imagePath.bio} style={{ alignSelf: 'center', height: scale(110), width: scale(110) }} />
                                <Text style={styles.phoneHeading}>Write a bio</Text>
                                <Text style={[styles.phoneHeading2, { marginVertical: moderateScaleVertical(20) }]}>Lorem ipsum dolor sit amet, consect etur adi piscing elit, sed do eiusmod tempor incididunt.</Text>
                                {/* <View>
                                    <TextInputC placeholder={'Enter a title'}
                                        value={Title}
                                        onChangeText={(text) => setTitle(text)}
                                    />
                                </View> */}
                                <View style={{ marginVertical: moderateScaleVertical(10) }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: moderateScaleVertical(10) }}>
                                        <Text style={styles.description}>Write a description</Text>
                                        <Text style={[styles.description, { color: Length > 0 ? '#005BD4' : '#4F4F4F' }]}>{Length}<Text style={styles.description}>/200</Text></Text>
                                    </View>
                                    <TextInputC placeholder={'Type here...'}
                                        value={Description}
                                        editable={true}
                                        onChangeText={(text) => {
                                            setDescription(text)
                                            setLength(text.length);
                                        }}
                                        multiline={true}
                                        numberOfLines={20}
                                        style={{ height: 200, textAlignVertical: 'top', }}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                    <View style={{ flex: 0.3, alignItems: 'center' }}>
                                        <Pressable
                                            android_ripple={{ color: 'red', borderless: true, radius: moderateScale(25), }}
                                            onPress={() => {
                                                if(route?.params?.isFrom == 'Main'){
                                                    navigation.navigate(navigationStrings.WHERE_STUDY,{isFrom:'Main'})
                                                  }else{
                                                   navigation.navigate(navigationStrings.WHERE_STUDY,{isFrom:'Auth'})
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
export default WriteBio;

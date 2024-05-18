//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Image, TouchableOpacity } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import ButtonComp from '../../Components/ButtonComp';
import { scale, moderateScale, moderateScaleVertical } from '../../styles/responsiveSize';
import ButtonComptwo from '../../Components/ButtonComptwo';
import TextInputC from '../../Components/TextInputC';
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getData } from '../../utils/helperFunctions';
import { useDispatch } from 'react-redux/es/exports';
import { saveUserData, userStatus } from '../../redux/Slices/UserSlice';
import Snackbar from 'react-native-snackbar';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { EmailRegister } from '../../API/Api';
import navigationStrings from '../../Navigation/navigationStrings';

// create a component
const Register = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(false);
    const [ProfileShow, setProfileShow] = useState(false)
    const [visible, setvisible] = useState(false)
    const [visible2, setvisible2] = useState(false)

    const SignupSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('E-mail Required'),
        Password: Yup.string().required('Password is required').matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{6,99}$/,
            'Must contain at least 6 Characters, 1 Uppercase, 1 Lowercase, 1 Special Character, and 1 Number'
        ),
        CPasord: Yup.string().required('Confirm Password Required').oneOf([Yup.ref('Password'), null], 'Passwords must match'),

    });



    // const handleSubmit = () => {
    //     setLoading(true);
    //     if (email === 'Gionee12@gmail.com' && Password === 'Roberto@123') {
    //         const userToken = getData('UserToken');
    //         console.log('token', userToken);
    //         setLoading(false);
    //         Snackbar.show({
    //             text: `${'Sign In SuccessFull!'}`,
    //             duration: Snackbar.LENGTH_SHORT,
    //             backgroundColor: '#005BD4',
    //             textColor: "#fff",
    //         });

    //         setTimeout(() => {
    //             dispatch(userStatus(true))
    //             Snackbar.dismiss();
    //         }, 2000)


    //     } else {
    //         setLoading(false);
    //         Snackbar.show({
    //             text: `${'Wrong Credentials or Please SignUp'}`,
    //             duration: Snackbar.LENGTH_SHORT,
    //             backgroundColor: 'red',
    //             textColor: "#fff",
    //         });
    //     }
    // }
    return (
        <WrapperContainer>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAwareScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={[styles.helpIcon, { justifyContent: 'space-between' }]}>
                            <TouchableOpacity
                                style={{ marginRight: moderateScale(10) }}
                                onPress={() => navigation.goBack()}>
                                <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                            </TouchableOpacity>
                            <Image source={imagePath.help_outline} />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <Image source={imagePath.Login} style={{ alignSelf: 'center', height: scale(96), width: scale(96) }} />
                            <Text style={styles.phoneHeading}>Sign Up</Text>
                            <Text style={[styles.phoneHeading2, { marginVertical: moderateScaleVertical(15) }]}>Lorem ipsum dolor sit amet, consect etur adi piscing </Text>
                            <View style={{ marginVertical: moderateScaleVertical(15), }}>
                                <Formik validationSchema={SignupSchema} initialValues={{ email: '', Password: '', CPasord: '', }}
                                    onSubmit={(values, { resetForm },) => {
                                        console.log(values);
                                        console.log(ProfileShow);
                                        if (!ProfileShow) {
                                            Snackbar.show({
                                                text: `${'Please accept Terms & Conditions.'}`,
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: 'red',
                                                textColor: "#fff",
                                            });
                                            return;

                                        }
                                        console.log(values);
                                        setLoading(true)
                                        EmailRegister(values.email, values.Password)
                                            .then((res) => {
                                                console.log(res, 'mailres')
                                                // let email=res.user.email;
                                                setLoading(false)
                                                Snackbar.show({
                                                    text: `${res.message}`,
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: '#005BD4',
                                                    textColor: "#fff",
                                                });
                                                // setTimeout(() => {
                                                //     Snackbar.dismiss();
                                                // navigation.navigate(navigationStrings.REGISTER)
                                                navigation.navigate(navigationStrings.EMAIL_VERIFY, { data: values.email })
                                                // }, 2000)
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                                setLoading(false)
                                                Snackbar.show({
                                                    text: `${err.response.data.email}`,
                                                    duration: Snackbar.LENGTH_SHORT,
                                                    backgroundColor: 'red',
                                                    textColor: "#fff",
                                                });
                                            })

                                    }}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched,
                                    }) => (
                                        <>
                                            <TextInputC
                                                placeholder={'Email'}
                                                keyBoardType={'email-address'}
                                                onChangeText={handleChange('email')}
                                                onBlur={handleBlur('email')}
                                                value={values.email}
                                            />
                                            {(errors.email && touched.email) && <Text style={{ fontSize: 14, color: 'red', marginLeft: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>{errors.email}</Text>}

                                            <TextInputC
                                                placeholder={'Password'}
                                                style={{ marginTop: moderateScaleVertical(10) }}
                                                imgright={true}
                                                imgsrc={visible ? imagePath.eyeoff : imagePath.eye}
                                                onPressSecure={() => setvisible(!visible)}
                                                secureText={visible}
                                                keyBoardType={'default'}
                                                onChangeText={handleChange('Password')}
                                                onBlur={handleBlur('Password')}
                                                value={values.Password}
                                            />
                                            {(errors.Password && touched.Password) && <Text style={{ fontSize: 14, color: 'red', marginLeft: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>{errors.Password}</Text>}

                                            <TextInputC
                                                placeholder={'Confirm Password'}
                                                onChangeText={handleChange('CPasord')}
                                                onBlur={handleBlur('CPasord')}
                                                value={values.CPasord}
                                                style={{ marginTop: moderateScaleVertical(10) }}
                                                imgright={true}
                                                imgsrc={visible2 ? imagePath.eyeoff : imagePath.eye}
                                                onPressSecure={() => setvisible2(!visible2)}
                                                secureText={visible2}
                                                keyBoardType={'default'}
                                            />
                                            {(errors.CPasord && touched.CPasord) && <Text style={{ fontSize: 14, color: 'red', marginLeft: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>{errors.CPasord}</Text>}

                                            <View style={{ marginVertical: moderateScaleVertical(10), }}>
                                                <BouncyCheckbox
                                                    size={20}
                                                    disableBuiltInState

                                                    isChecked={ProfileShow}
                                                    onPress={() => setProfileShow(!ProfileShow)}
                                                    unfillColor="#FFFFFF"
                                                    fillColor='#005BD4'
                                                    text="I accept all the Terms and Conditions."
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
                                            </View>
                                            <ButtonComp  onPress={handleSubmit} isLoading={Loading} text='Submit' style={{ backgroundColor: '#005BD4', marginVertical: moderateScaleVertical(10) }} />
                                        </>
                                    )}
                                </Formik>
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
    }
});

//make this component available to the app
export default Register;

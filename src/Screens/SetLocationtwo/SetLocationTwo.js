//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import TextInputC from '../../Components/TextInputC';
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import navigationStrings from '../../Navigation/navigationStrings';
import { LocationTwo } from '../../API/Api';
import Snackbar from 'react-native-snackbar';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { saveUserData } from '../../redux/Slices/UserSlice';



// create a component
const SetLocationTwo = ({ navigation }) => {
    const dispatch = useDispatch();

    // const [FullAdress, setFullAdress] = useState('');
    // const [Apartment, setApartment] = useState('');
    // const [State, setState] = useState('');
    // const [Street, setStreet] = useState('');
    // const [City, setCity] = useState('');
    // const [Zip, setZip] = useState('');
    // const [Enter, setEnter] = useState('');
    const [ProfileShow, setProfileShow] = useState('');
    const [latitude, setlatitude] = useState('28.7041')
    const [longitude, setlongitude] = useState('77.1025')
    const [Loading, setLoading] = useState(false);


    // const handleSubmit = () => {
    //     setLoading(true);
    //     console.log(FullAdress)
    //     console.log(Apartment)
    //     console.log(State)
    //     console.log(Street)
    //     console.log(City)
    //     console.log(Zip)
    //     console.log(Enter)
    //     console.log(ProfileShow)
    //     LocationTwo(FullAdress, Apartment, State, Street, City, Zip, Enter, ProfileShow, latitude, longitude)
    //         .then((res) => {
    //             console.log(res)
    //             setLoading(false);
    //             Snackbar.show({
    //                 text: `${res.message}`,
    //                 duration: Snackbar.LENGTH_SHORT,
    //                 backgroundColor: '#005BD4',
    //                 textColor: "#fff",
    //             });
    //             setTimeout(() => {
    //                 Snackbar.dismiss();
    //                 navigation.navigate(navigationStrings.SELECT_GENDER)
    //             }, 2000)
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //             setLoading(false);
    //             Snackbar.show({
    //                 text: `${err.message}`,
    //                 duration: Snackbar.LENGTH_SHORT,
    //                 backgroundColor: 'red',
    //                 textColor: "#fff",
    //             });

    //         })
    //     // navigation.navigate(navigationStrings.SELECT_GENDER)
    // }
    const SetLocationSchema = Yup.object().shape({
        Full_address: Yup.string().required('Full address Required'),
        House_number: Yup.string().required('House number Required'),
        State: Yup.string().required('State Required'),
        Street: Yup.string().required('Street Required'),
        City: Yup.string().required('City Required'),
        Zip_Code: Yup.string().required('Zip code Required'),
        Enter: Yup.string().required('Save address type Required'),
    });


    return (
        <WrapperContainer>
            <View style={styles.container}>
                <View style={[styles.helpIcon, { justifyContent: 'space-between' }]}>
                    <TouchableOpacity
                        style={{ marginRight: moderateScale(10) }}
                        onPress={() => navigation.goBack()}>
                        <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                    </TouchableOpacity>
                    <Image source={imagePath.help_outline} />
                </View>
                <Image source={imagePath.location} style={{ alignSelf: 'center', height: scale(100), width: scale(100) }} />
                <Text style={styles.phoneHeading}>Set a location</Text>
                <Text style={styles.phoneHeading2}>Lorem ipsum dolor sit amet, consect etur adi piscing elit, sed do eiusmod tempor incididunt.</Text>
                <KeyboardAwareScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Complete address</Text>
                    <Formik validationSchema={SetLocationSchema} initialValues={{
                        Full_address: '', House_number: '', State: '', Street: '', City: '', Zip_Code: '', Enter: ''
                    }}
                        onSubmit={(values, { resetForm },) => {
                            setLoading(true);
                            LocationTwo(values.Full_address, values.House_number, values.State, values.Street, values.City, values.Zip_Code, values.Enter, ProfileShow, latitude, longitude)
                                .then((res) => {
                                    console.log(res, 'location')
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
                                    navigation.navigate(navigationStrings.SELECT_GENDER)
                                    // }, 2000)
                                })
                                .catch((err) => {
                                    console.log(err)
                                    setLoading(false);
                                    Snackbar.show({
                                        text: `${err.message}`,
                                        duration: Snackbar.LENGTH_SHORT,
                                        backgroundColor: 'red',
                                        textColor: "#fff",
                                    });

                                })

                        }}>
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched,
                        }) => (
                            <>
                                <View style={{ paddingHorizontal: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>
                                    <TextInputC
                                        placeholder={'Full address'}
                                        keyBoardType={'default'}
                                        onChangeText={handleChange('Full_address')}
                                        onBlur={handleBlur('Full_address')}
                                        value={values.Full_address}
                                    />
                                    {(errors.Full_address && touched.Full_address) && <Text style={{ fontSize: 14, color: 'red', marginLeft: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>{errors.Full_address}</Text>}
                                </View>
                                <View style={{ paddingHorizontal: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>

                                    <TextInputC
                                        placeholder={'Apartment/House number *'}
                                        keyBoardType={'numeric'}
                                        onChangeText={handleChange('House_number')}
                                        onBlur={handleBlur('House_number')}
                                        value={values.House_number}
                                    />
                                    {(errors.House_number && touched.House_number) && <Text style={{ fontSize: 14, color: 'red', marginLeft: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>{errors.House_number}</Text>}
                                </View>
                                <View style={{ paddingHorizontal: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>
                                    <TextInputC
                                        placeholder={'State'}
                                        keyBoardType={'default'}
                                        onChangeText={handleChange('State')}
                                        onBlur={handleBlur('State')}
                                        value={values.State}
                                    />
                                    {(errors.State && touched.State) && <Text style={{ fontSize: 14, color: 'red', marginLeft: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>{errors.State}</Text>}
                                </View>
                                <View style={{ paddingHorizontal: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>
                                    <TextInputC
                                        placeholder={'Street'}
                                        keyBoardType={'default'}
                                        onChangeText={handleChange('Street')}
                                        onBlur={handleBlur('Street')}
                                        value={values.Street}
                                    />
                                    {(errors.Street && touched.Street) && <Text style={{ fontSize: 14, color: 'red', marginLeft: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>{errors.Street}</Text>}
                                </View>
                                <View style={{ paddingHorizontal: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>
                                    <TextInputC
                                        placeholder={'City'}
                                        keyBoardType={'default'}
                                        onChangeText={handleChange('City')}
                                        onBlur={handleBlur('City')}
                                        value={values.City}
                                    />
                                    {(errors.City && touched.City) && <Text style={{ fontSize: 14, color: 'red', marginLeft: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>{errors.City}</Text>}
                                </View>
                                <View style={{ paddingHorizontal: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>
                                    <TextInputC
                                        placeholder={'Zip code *'}
                                        keyBoardType={'numeric'}
                                        onChangeText={handleChange('Zip_Code')}
                                        onBlur={handleBlur('Zip_Code')}
                                        value={values.Zip_Code}
                                    />
                                    {(errors.Zip_Code && touched.Zip_Code) && <Text style={{ fontSize: 14, color: 'red', marginLeft: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>{errors.Zip_Code}</Text>}
                                </View>
                                <View style={{ paddingHorizontal: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>
                                    <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700', marginVertical: moderateScaleVertical(2) }]}>Save address as</Text>

                                    <TextInputC
                                        placeholder={'Enter'}
                                        keyBoardType={'default'}
                                        onChangeText={handleChange('Enter')}
                                        onBlur={handleBlur('Enter')}
                                        value={values.Enter}
                                    />
                                    {(errors.Enter && touched.Enter) && <Text style={{ fontSize: 14, color: 'red', marginLeft: moderateScale(2), marginVertical: moderateScaleVertical(5) }}>{errors.Enter}</Text>}
                                </View>
                                <View style={{ paddingHorizontal: moderateScaleVertical(8), marginVertical: moderateScaleVertical(5) }}>
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

                                <ButtonComp onPress={handleSubmit} isLoading={Loading} text='Save address' style={{ backgroundColor: '#005BD4', marginVertical: moderateScaleVertical(10) }} />
                            </>
                        )}
                    </Formik>





                    {/* <View style={{ marginVertical: moderateScaleVertical(5) }}>
                        <TextInputC placeholder={'Full address'}
                            value={FullAdress}
                            onChangeText={(text) => setFullAdress(text)}
                            keyBoardType='email-address'
                        />
                    </View>
                    <View style={{ marginVertical: moderateScaleVertical(5) }}>
                        <TextInputC
                            placeholder={'Apartment/House number *'}
                            value={Apartment}
                            onChangeText={(text) => setApartment(text)}
                            keyBoardType={'numeric'}
                        />
                    </View>
                    <View style={{ marginVertical: moderateScaleVertical(5) }}>
                        <TextInputC
                            placeholder={'State'}
                            value={State}
                            onChangeText={(text) => setState(text)}
                        />
                    </View>
                    <View style={{ marginVertical: moderateScaleVertical(5) }}>
                        <TextInputC
                            placeholder={'Street'}
                            value={Street}
                            onChangeText={(text) => setStreet(text)}
                        />
                    </View>
                    <View style={{ marginVertical: moderateScaleVertical(5) }}>
                        <TextInputC
                            placeholder={'City'}
                            value={City}
                            onChangeText={(text) => setCity(text)}
                        />
                    </View>
                    <View style={{ marginVertical: moderateScaleVertical(5) }}>
                        <TextInputC
                            placeholder={'Zip code *'}
                            value={Zip}
                            onChangeText={(text) => setZip(text)}
                            keyBoardType={'numeric'}
                        />
                    </View>
                    <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Save address as</Text>
                    <View style={{ marginVertical: moderateScaleVertical(5) }}>
                        <TextInputC
                            placeholder={'Enter'}
                            value={Enter}
                            onChangeText={(text) => setEnter(text)}
                        />
                    </View>
                    <View style={{ marginVertical: moderateScaleVertical(10) }}>
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
                    <View style={{ marginTop: moderateScaleVertical(20), justifyContent: 'flex-end' }}>
                        <ButtonComp isLoading={Loading} onPress={handleSubmit} text='Save address' style={{ backgroundColor: '#005BD4' }} />
                    </View> */}
                </KeyboardAwareScrollView>
            </View>
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
export default SetLocationTwo;

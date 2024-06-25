//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale, textScale, moderateScaleVertical } from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import ButtonComp from '../../Components/ButtonComp';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import Loader from '../../Components/Loader';
import Snackbar from 'react-native-snackbar';
import navigationStrings from '../../Navigation/navigationStrings';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserData } from '../../redux/Slices/UserSlice';
import {
    PaymentIntents,
    initPaymentSheet,
    initStripe,
    presentPaymentSheet,
    confirmPaymentSheetPayment,
} from '@stripe/stripe-react-native';
import { STRIPE_KEY, STRIPE_KEY_TEST, createPaymentIntent, getEphemeralKey } from '../../API/Api';
// create a component
const PlansDetails = ({ navigation, route }) => {
    const Dispatch = useDispatch();
    const Id = route.params.id;
    const user = useSelector((state) => state.persistedReducer.authSlice.userData);

    // console.log(Id, 'Id');

    const [Plan, setPlan] = useState('');
    const [LoadEvent, setLoadEvent] = useState(false)
    const [Loading, setLoading] = useState(false);
    const generateRandomId = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    useEffect(() => {
        getPlan();

        // async function initialize() {
        //     await initStripe({
        //         publishableKey: STRIPE_KEY,
        //         urlScheme: 'myapp',
        //     });
        // }
        // initialize()
        //     .then(async res => {
        //         console.log('ds===', res);
        //     })
        //     .catch(error => {
        //         console.log('error===', error);
        //     });


        // initStripe({
        //     publishableKey: STRIPE_KEY_TEST,
        //     urlScheme: 'myapp',
        // }).then(res => {
        //     console.log('ds===', res);
        // })
        //     .catch(err => {
        //         console.log('error===', error);
        //     })
    }, [])
    const getPlan = async () => {
        setLoadEvent(true)
        // setLoadEvent(true)
        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': 'multipart/form-data',
        };
        axios.get(`https://plansaround-backend.vercel.app/api/mobile/packages/${Id}`, { headers })
            .then((res) => {
                console.log(res, 'plandetails')
                setLoadEvent(false)
                setPlan(res.data.package)
                // setEventData(res.data.events)
                // setLoadEvent(false)
            }).
            catch((err) => {
                console.log(err)
                // setLoadEvent(false)
            })
    }

    const openPaymentSheet = () => {
        console.log("RES===");

        setLoading(true)
        getEphemeralKey()
            .then(res => {
                console.log("RES===", res);
                createPaymentIntent(Plan.amount)
                    .then(async mainRes => {
                        console.log("RES11===", mainRes);
                        setLoading(false)
                        try {



                            const paymentInit = await initPaymentSheet({
                                customerId: res?.customer,
                                customerEphemeralKeySecret: res?.ephemeralKey,
                                paymentIntentClientSecret:
                                    mainRes?.paymentIntent?.client_secret,
                                merchantDisplayName: user?.fullName,
                                returnURL: 'stripe-example://stripe-redirect',
                                customFlow: true,
                            });
                            console.log('paymentInit====', paymentInit);

                            const { error, paymentOption } = await presentPaymentSheet();
                            console.log('error====', error);

                            const { error: err } = await confirmPaymentSheetPayment();
                            console.log('confirmPayment====', err);
                            if (err) {
                                alert('Payment is decline.');
                            }
                            handleSelect(Plan._id, mainRes?.paymentIntent.id)
                            // console.log("PAYMENT===", mainRes?.paymentIntent.id);
                        } catch (error) {
                            console.log("PAYMENTerror===", error);

                        }
                    })
                    .catch(err => {
                        console.log("err111===", err);

                        setLoading(false)
                    })
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
    }

    const handleSelect = async (planId, paymentId) => {
        console.log('planId', planId)
        setLoading(true)
        let usertoken = await getData('UserToken');
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        axios.post(`https://plansaround-backend.vercel.app/api/mobile/packages/${planId}/purchase`, { "purchaseId": paymentId }, { headers },)
            .then(async (res) => {

                const response = await axios.get(`https://plansaround-backend.vercel.app/api/mobile/profile`, { headers });
                const responseData = response.data?.user;
                console.log("response===", responseData);
                setLoading(false)
                Dispatch(saveUserData(responseData))

                Snackbar.show({
                    text: `${'Plan Purchased Successfully!'}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });
                navigation.navigate(navigationStrings.HOME)
            }).
            catch((err) => {
                setLoading(false)
                console.log(err)
                Snackbar.show({
                    text: `${err.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    textColor: "#fff",
                });
                // setLoadEvent(false)
            })

    }
    return (
        <WrapperContainer>
            <HeaderBack mainText='Package Details' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <View style={styles.container}>
                {
                    LoadEvent ? <Loader /> : (
                        Plan && Plan ?
                            <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(20), width: '100%' }}>
                                <View>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(18), textAlign: 'center' }]}>{Plan[0]?.title}</Text>
                                    <Image source={{ uri: Plan.image }} style={{ height: moderateScaleVertical(150), width: moderateScale(150), borderRadius: moderateScale(75), alignSelf: 'center', marginVertical: moderateScaleVertical(10) }} />
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(14), fontWeight: '400', marginVertical: moderateScaleVertical(10) }]}>{Plan.shortDescription}</Text>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(14), fontWeight: '400', marginVertical: moderateScaleVertical(10) }]}>{Plan.longDescription}</Text>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(18), marginBottom: moderateScaleVertical(10) }]}>Amount: {Plan.amount}€</Text>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(18), marginBottom: moderateScaleVertical(10) }]}>Validity: {Plan.noOfDays}</Text>
                                </View>
                                <ButtonComp text='Pay Now' isLoading={Loading} onPress={() => {
                                    openPaymentSheet()
                                    // handleSelect(Plan._id)
                                }} style={{ backgroundColor: '#005BD4', }} />
                            </View>
                            :
                            <Text style={[styles.phoneHeading, { fontSize: textScale(18), textAlign: 'center' }]}>{'No Details'}</Text>
                    )
                }
            </View>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(12),
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center'
    },
    phoneHeading: {
        fontSize: textScale(24),
        fontFamily: 'Roboto',
        fontWeight: '800',
        color: '#333'
    },
    phoneHeading2: {
        fontSize: textScale(14),
        fontFamily: 'Roboto',
        fontWeight: '500',
        color: '#4F4F4F'
    },
});

//make this component available to the app
export default PlansDetails;

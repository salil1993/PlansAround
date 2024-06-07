//import liraries
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import TextInputC from '../../Components/TextInputC';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import navigationStrings from '../../Navigation/navigationStrings';
import Snackbar from 'react-native-snackbar';
import { getReligiousBelief } from '../../API/Api';
import RadioForm from 'react-native-simple-radio-button'
import { useDispatch, useSelector } from 'react-redux';
import { saveUserData } from '../../redux/Slices/UserSlice';


// create a component
const ReligiousBelief = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.persistedReducer?.authSlice?.userData);
    const [Judaism, setJudaism] = useState(false)
    const [Christianity, setChristianity] = useState(false)
    const [Islam, setIslam] = useState(false)
    const [Hinduism, setHinduism] = useState(false)
    const [Buddhism, setBuddhism] = useState(false)
    const [Agnostic, setAgnostic] = useState(false)
    const [Atheist, setAtheist] = useState(false)
    const [Animism, setAnimism] = useState(false)
    const [Polytheism, setPolytheism] = useState(false)
    const [Monotheism, setMonotheism] = useState(false)
    const [ProfileShow, setProfileShow] = useState(false)
    const [Other, setOther] = useState(false)
    const [OtherGender, setOtherGender] = useState('')

    const [dsbJud, setDsbJud] = useState(false);
    const [DsbCh, setDsbCh] = useState(false);
    const [DsbIs, setDsbIs] = useState(false);
    const [DsbHi, setDsbHi] = useState(false);
    const [DsbBud, setDsbBud] = useState(false);
    const [DsbAgno, setDsbAgno] = useState(false);
    const [DsbAth, setDsbAth] = useState(false);
    const [DsbAnim, setDsbAnim] = useState(false);
    const [DsbPoly, setDsbPoly] = useState(false);
    const [DsbMono, setDsbMono] = useState(false);
    const [DsbEnter, setDsbEnter] = useState(false);

    const [Selected, setSelected] = useState('');
    const [Loading, setLoading] = useState(false);

    const [selected, setselected] = useState('');

    const [value, setvalue] = useState('');
    // const HandleSelect = (value, profession) => {
    //     console.log(value, profession);

    //     if (profession === 'Judaism') {
    //         setDsbCh(true);
    //         setDsbIs(true);
    //         setDsbHi(true);
    //         setDsbBud(true);
    //         setDsbAgno(true);
    //         setDsbAth(true);
    //         setDsbAnim(true);
    //         setDsbPoly(true);
    //         setDsbMono(true);
    //         setDsbEnter(true);
    //         setSelected('Judaism')
    //     }
    //     if (profession === 'Christianity') {
    //         setDsbJud(true);
    //         setDsbIs(true);
    //         setDsbHi(true);
    //         setDsbBud(true);
    //         setDsbAgno(true);
    //         setDsbAth(true);
    //         setDsbAnim(true);
    //         setDsbPoly(true);
    //         setDsbMono(true);
    //         setDsbEnter(true);
    //         setSelected('Christianity')
    //     }
    //     if (profession === 'Islam') {
    //         setDsbCh(true);
    //         setDsbJud(true);
    //         setDsbHi(true);
    //         setDsbBud(true);
    //         setDsbAgno(true);
    //         setDsbAth(true);
    //         setDsbAnim(true);
    //         setDsbPoly(true);
    //         setDsbMono(true);
    //         setDsbEnter(true);
    //         setSelected('Islam')
    //     }
    //     if (profession === 'Hinduism') {
    //         setDsbCh(true);
    //         setDsbJud(true);
    //         setDsbHi(true);
    //         setDsbBud(true);
    //         setDsbAgno(true);
    //         setDsbAth(true);
    //         setDsbAnim(true);
    //         setDsbPoly(true);
    //         setDsbMono(true);
    //         setDsbEnter(true);
    //         setSelected('Hinduism')
    //     }
    //     if (profession === 'Buddhism') {
    //         setDsbCh(true);
    //         setDsbJud(true);
    //         setDsbHi(true);
    //         setDsbIs(true);
    //         setDsbAgno(true);
    //         setDsbAth(true);
    //         setDsbAnim(true);
    //         setDsbPoly(true);
    //         setDsbMono(true);
    //         setDsbEnter(true);
    //         setSelected('Buddhism')
    //     }
    //     if (profession === 'Agnostic') {
    //         setDsbCh(true);
    //         setDsbJud(true);
    //         setDsbHi(true);
    //         setDsbIs(true);
    //         setDsbBud(true);
    //         setDsbAth(true);
    //         setDsbAnim(true);
    //         setDsbPoly(true);
    //         setDsbMono(true);
    //         setDsbEnter(true);
    //         setSelected('Agnostic')
    //     }
    //     if (profession === 'Atheist') {
    //         setDsbCh(true);
    //         setDsbJud(true);
    //         setDsbHi(true);
    //         setDsbIs(true);
    //         setDsbBud(true);
    //         setDsbAgno(true);
    //         setDsbAnim(true);
    //         setDsbPoly(true);
    //         setDsbMono(true);
    //         setDsbEnter(true);
    //         setSelected('Atheist')
    //     }
    //     if (profession === 'Animism') {
    //         setDsbCh(true);
    //         setDsbJud(true);
    //         setDsbHi(true);
    //         setDsbIs(true);
    //         setDsbBud(true);
    //         setDsbAgno(true);
    //         setDsbAth(true);
    //         setDsbPoly(true);
    //         setDsbMono(true);
    //         setDsbEnter(true);
    //         setSelected('Animism')
    //     }
    //     if (profession === 'Polytheism') {
    //         setDsbCh(true);
    //         setDsbJud(true);
    //         setDsbHi(true);
    //         setDsbIs(true);
    //         setDsbBud(true);
    //         setDsbAgno(true);
    //         setDsbAth(true);
    //         setDsbAnim(true);
    //         setDsbMono(true);
    //         setDsbEnter(true);
    //         setSelected('Polytheism')
    //     }
    //     if (profession === 'Monotheism') {
    //         setDsbCh(true);
    //         setDsbJud(true);
    //         setDsbHi(true);
    //         setDsbIs(true);
    //         setDsbBud(true);
    //         setDsbAgno(true);
    //         setDsbAth(true);
    //         setDsbAnim(true);
    //         setDsbPoly(true);
    //         setDsbEnter(true);
    //         setSelected('Monotheism')
    //     }
    //     if (profession === 'Other') {
    //         setDsbCh(true);
    //         setDsbJud(true);
    //         setDsbHi(true);
    //         setDsbIs(true);
    //         setDsbBud(true);
    //         setDsbAgno(true);
    //         setDsbAth(true);
    //         setDsbAnim(true);
    //         setDsbPoly(true);
    //         setDsbMono(true);
    //     }

    // }
    const radioButtons = useMemo(() => ([
        {
            // acts as primary key, should be unique and non-empty string
            value: 'Judaism',
            label: 'Judaism'
        },
        {

            value: 'Christianity',
            label: 'Christianity'
        },
        {

            value: 'Islam',
            label: 'Islam'
        },
        {

            value: 'Hinduism',
            label: 'Hinduism'
        },
        {

            value: 'Buddhism',
            label: 'Buddhism'
        },
        {

            value: 'Agnostic',
            label: 'Agnostic'
        },
        {

            value: 'Atheist',
            label: 'Atheist'
        },
        {

            value: 'Animism',
            label: 'Animism'
        },
        {

            value: 'Polytheism',
            label: 'Polytheism'
        },
        {

            value: 'Monotheism',
            label: 'Monotheism'
        },
        {

            value: 'Other',
            label: 'Other'
        },
    ]), []);

    useEffect(() => {
        setselected(user?.religiousBelief?.name)
        setProfileShow(user?.religiousBelief?.showOnProfile)

    }, [])

    const handleSelect = (label) => {
        console.log(label)
        if (label === 'Select a religion') {
            setselected('')

        } else {
            setselected(label)
            setOther(false)
        }

    }



    const handleSumbit = () => {
        console.log(selected, 'finalvalues')
        if (selected) {
            setLoading(true)
            getReligiousBelief(selected, ProfileShow).then((res) => {
                console.log(res, 'religious');
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
                if (route?.params?.isFrom == 'Main') {
                    navigation.navigate(navigationStrings.INTERESTS, { isFrom: 'Main' })
                } else {
                    navigation.navigate(navigationStrings.INTERESTS, { isFrom: 'Auth' })
                }

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
                text: `${'Please Select Religious Belief'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }

    }
    return (
        <WrapperContainer>
            <View style={styles.container}>
                <View style={[styles.helpIcon, { justifyContent: 'space-between', }]}>
                    <TouchableOpacity
                        style={{ marginRight: moderateScale(10) }}
                        onPress={() => navigation.goBack()}>
                        <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                    </TouchableOpacity>
                    <Image source={imagePath.help_outline} />
                </View>
                <KeyboardAwareScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
                    <View style={{ flex: 0.9, justifyContent: 'flex-start' }}>
                        <Image source={imagePath.religion} style={{ alignSelf: 'center', height: scale(110), width: scale(110) }} />
                        <Text style={styles.phoneHeading}>Religious Belief</Text>
                        <Text style={styles.phoneHeading2}>Lorem ipsum dolor sit amet, consect etur adi piscing elit, sed do eiusmod tempor incididunt.</Text>
                        <View style={{ marginVertical: moderateScaleVertical(10) }}>
                            <View style={styles.slidercontainer}>
                                <View style={{}}>
                                    {radioButtons.map((item, index) => {
                                        return (
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginVertical: 10 }}>
                                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => {
                                                    if (item.label === 'Select a religion') {
                                                        setOther(true)
                                                        handleSelect(item.label)
                                                    } else {
                                                        handleSelect(item.label)

                                                    }
                                                }}>
                                                    <Image style={{ height: 24, width: 24, resizeMode: 'contain', tintColor: '#828282' }} source={item.value == selected ? imagePath.radio_select : imagePath.radio_unselect} />
                                                </TouchableOpacity>
                                                <Text style={{ color: '#4F4F4F', fontWeight: '500' }} >{item.value}</Text>
                                            </View>
                                        )
                                    })
                                    }
                                </View>
                                {/* <RadioForm
                                    radio_props={radioButtons}
                                    initial={value}
                                    buttonColor={'#828282'}
                                    animation={true}
                                    onPress={(label) => {
                                        if (label === 'Select a religion') {
                                            setOther(true)
                                            handleSelect(label)
                                        } else {
                                            handleSelect(label)

                                        }
                                    }}
                                    labelcolor='#828282'
                                    buttonSize={15}
                                /> */}


                                {/* <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disabled={dsbJud}
                                        disableBuiltInState
                                        isChecked={Judaism}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Judaism')
                                            setJudaism(true)
                                        }}

                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Judaism"
                                        innerIconStyle={{

                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Judaism ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disabled={DsbCh}
                                        disableBuiltInState
                                        isChecked={Christianity}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Christianity')
                                            setChristianity(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Christianity"
                                        innerIconStyle={{

                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Christianity ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disableBuiltInState
                                        disabled={DsbIs}
                                        isChecked={Islam}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Islam')
                                            setIslam(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Islam"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Islam ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disableBuiltInState
                                        disabled={DsbHi}
                                        isChecked={Hinduism}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Hinduism')
                                            setHinduism(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Hinduism"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Hinduism ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disableBuiltInState
                                        disabled={DsbBud}
                                        isChecked={Buddhism}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Buddhism')
                                            setBuddhism(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Buddhism"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Buddhism ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disableBuiltInState
                                        disabled={DsbAgno}
                                        isChecked={Agnostic}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Agnostic')
                                            setAgnostic(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Agnostic"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Agnostic ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disableBuiltInState
                                        disabled={DsbAth}
                                        isChecked={Atheist}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Atheist')
                                            setAtheist(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Atheist"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Atheist ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disableBuiltInState
                                        isChecked={Animism}
                                        disabled={DsbAnim}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Animism')
                                            setAnimism(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Animism"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Animism ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disableBuiltInState
                                        isChecked={Polytheism}
                                        disabled={DsbPoly}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Polytheism')
                                            setPolytheism(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Polytheism"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Polytheism ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disableBuiltInState
                                        isChecked={Monotheism}
                                        disabled={DsbMono}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Monotheism')
                                            setMonotheism(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Monotheism"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Monotheism ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                <View style={{ marginVertical: moderateScaleVertical(5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                    <BouncyCheckbox
                                        size={20}
                                        disableBuiltInState
                                        disabled={DsbEnter}
                                        isChecked={Other}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Other')
                                            setOther(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Enter religion"
                                        innerIconStyle={{

                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Other ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
                                        }}
                                        textStyle={{
                                            textDecorationLine: "none",
                                            color: '#4F4F4F',
                                            fontSize: scale(14),
                                            fontWeight: '400',
                                            fontFamily: 'Roboto'
                                        }}
                                    />
                                    <Pressable onPress={() => setOther(!Other)}>
                                        <Image source={imagePath.edit} />
                                    </Pressable>
                                </View> */}
                                {
                                    Other && <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}>
                                        <TextInputC placeholder={'Enter your Religion'}
                                            style={{ elevation: 0, backgroundColor: null, }}
                                            autoFocus={true}
                                            value={selected}
                                            onChangeText={(text) => setselected(text)}
                                        />
                                    </View>
                                }
                            </View>
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
                                        if (route?.params?.isFrom == 'Main') {
                                            navigation.navigate(navigationStrings.INTERESTS, { isFrom: 'Main' })
                                        } else {
                                            navigation.navigate(navigationStrings.INTERESTS, { isFrom: 'Auth' })
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
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    phoneHeading: {
        fontSize: scale(24),
        fontFamily: 'Roboto',
        fontWeight: '800',
        color: '#333',
        marginVertical: moderateScaleVertical(15)
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
    slidercontainer: {
        backgroundColor: '#fff',
        // height: scale(200),
        padding: scale(10),
        elevation: 3
    },
    skip: {
        color: '#4F4F4F',
        fontSize: scale(16),
        fontFamily: 'Roboto',
        fontWeight: '600',
    }


});

//make this component available to the app
export default ReligiousBelief;

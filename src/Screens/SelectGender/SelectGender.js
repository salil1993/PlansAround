//import liraries
import React, { Component, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import TextInputC from '../../Components/TextInputC';
import navigationStrings from '../../Navigation/navigationStrings';
import { getGender } from '../../API/Api';
import Snackbar from 'react-native-snackbar';
import RadioForm from 'react-native-simple-radio-button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux';
import { saveUserData } from '../../redux/Slices/UserSlice';




// create a component
const SelectGender = ({ navigation }) => {
  const dispatch = useDispatch();

    const [ProfileShow, setProfileShow] = useState(false)

    const [Other, setOther] = useState(false)

    const [selected, setselected] = useState('');

    const [value, setvalue] = useState('');
    const [Loading, setLoading] = useState(false);

    const radioButtons = useMemo(() => ([
        {
            // acts as primary key, should be unique and non-empty string
            value: 'Male',
            label: 'Male'
        },
        {

            value: 'Female',
            label: 'Female'
        },
        {

            value: 'Prefer not to say',
            label: 'Prefer not to say'
        },
        {

            value: 'Other',
            label: 'Other'
        }
    ]), []);




    const handleSumbit = () => {
        console.log(selected, 'finalvalue')

        if (selected) {

            setLoading(true);
            getGender(ProfileShow, selected).then((res) => {
                console.log(res,'gender');
                const data = res.user;
                dispatch(saveUserData(data));
                setLoading(false);
                setselected('')
                Snackbar.show({
                    text: `${res.message}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#005BD4',
                    textColor: "#fff",
                });
                // setTimeout(() => {
                //     Snackbar.dismiss();
                navigation.navigate(navigationStrings.WRITE_BIO)
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
                text: `${'Please Select Gender'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });

        }
    }

    // const handleSelect = (data, gender) => {

    //     console.log(data, 'function m', gender)
    //     if (gender === 'Male') {
    //         setdisablewoMen(true)
    //         setdisableother(true)
    //         setdisableprefer(true);
    //         setSelected('Male')
    //         console.log(Selected);
    //     }
    //     if (gender === 'FeMale') {
    //         setdisableMan(true)
    //         setdisableother(true)
    //         setdisableprefer(true);
    //         setSelected('FeMale')
    //         console.log(Selected);

    //     }
    //     if (gender === 'preferNottoSay') {
    //         setdisableMan(true)
    //         setdisableother(true)
    //         setdisablewoMen(true);
    //         setSelected('preferNottoSay')
    //         console.log(Selected);

    //     }
    //     if (gender === 'Other') {
    //         setdisableMan(true)
    //         setdisableprefer(true)
    //         setdisablewoMen(true);

    //     }
    // }


    const handleSelect = (label) => {
        if (label === 'Other') {
            setselected('')

        } else {
            setselected(label)
            setOther(false)
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
                <KeyboardAwareScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 0.9, justifyContent: 'flex-start' }}>
                        <Image source={imagePath.gender} style={{ alignSelf: 'center', height: scale(110), width: scale(110) }} />
                        <Text style={styles.phoneHeading}>Select a gender</Text>
                        <Text style={[styles.phoneHeading2, { marginVertical: moderateScaleVertical(10) }]}>Lorem ipsum dolor sit amet, consect etur adi piscing elit, sed do eiusmod tempor incididunt.</Text>
                        <View style={{ marginVertical: moderateScaleVertical(10) }}>
                            <View style={styles.slidercontainer}>
                            <View style={{}}>
                                    {radioButtons.map((item, index)=>{
                                        return(
                                            <View style={{flexDirection:'row', alignItems:'center', marginRight:10, marginVertical:10}}>
                                            <TouchableOpacity style={{marginRight:5}} onPress={()=>{
                                            if (item.label === 'Other') {
                                                setOther(true)
                                                handleSelect(item.label)
                                            } else {
                                                handleSelect(item.label)
    
                                            }
                                            }}>
                                             <Image style={{height:24, width:24, resizeMode:'contain', tintColor:'#828282'}} source={item.value == selected || item.value == 'Other'&& Other == true ?imagePath.radio_select:imagePath.radio_unselect}/>
                                         </TouchableOpacity>
                                          <Text style={{color: '#4F4F4F', fontWeight: '500' }} >{item.value}</Text>
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
                                        if (label === 'Other') {
                                            setOther(true)
                                            handleSelect(label)
                                        } else {
                                            handleSelect(label)

                                        }
                                    }}
                                    labelcolor='#828282'
                                    buttonSize={15}
                                /> */}
                                {
                                    Other && <View style={{  }}>
                                        <TextInputC placeholder={'Enter your Gender'}
                                           editable={true}
                                            style={{ elevation: 0, backgroundColor: null, }}
                                            autoFocus={true}
                                            value={selected}
                                            onChangeText={(text) => setselected(text)}
                                        />
                                    </View>
                                }
                            </View>
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(5), }}>
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
                        <ButtonComp isLoading={Loading} onPress={handleSumbit} text='Submit' style={{ backgroundColor: '#005BD4', marginTop: moderateScaleVertical(20) }} />
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </WrapperContainer>
    );
}


{/* <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <BouncyCheckbox
                                        size={20}
                                        disabled={disableMan}
                                        disableBuiltInState
                                        isChecked={Male}
                                        onPress={(isChecked) => {
                                            handleSelect(!isChecked, 'Male')
                                            setMale(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Man"
                                        innerIconStyle={{

                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Male ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                        disabled={disablewoMen}
                                        disableBuiltInState
                                        isChecked={FeMale}
                                        onPress={(isChecked) => {
                                            handleSelect(!isChecked, 'FeMale')
                                            setFeMale(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Female"
                                        innerIconStyle={{

                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: FeMale ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                        disabled={disbledprefer}
                                        disableBuiltInState
                                        isChecked={NotTosay}
                                        onPress={(isChecked) => {
                                            handleSelect(!isChecked, 'preferNottoSay')
                                            setNotToSay(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Prefer not to say"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: NotTosay ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                        disabled={disbledother}
                                        disableBuiltInState
                                        isChecked={Other}
                                        onPress={(isChecked) => {
                                            handleSelect(!isChecked, 'Other')
                                            setOther(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Other"
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

;

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
    slidercontainer: {
        backgroundColor: '#ffffff',
        padding: scale(10),
        elevation: 1,
        borderRadius: scale(5)
    },


});

//make this component available to the app
export default SelectGender;

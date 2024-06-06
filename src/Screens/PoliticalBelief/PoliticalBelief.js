//import liraries
import React, { Component, useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import navigationStrings from '../../Navigation/navigationStrings';
import { getPoliticalBelief } from '../../API/Api';
import Snackbar from 'react-native-snackbar';
import RadioForm from 'react-native-simple-radio-button'
import { useDispatch } from 'react-redux';
import { saveUserData } from '../../redux/Slices/UserSlice';



// create a component
const PoliticalBelief = ({ navigation, route }) => {
    const dispatch = useDispatch();


    const [ProfileShow, setProfileShow] = useState(false)


    const [Selected, setSelected] = useState('');
    const [Loading, setLoading] = useState(false);


    const [value, setvalue] = useState('');
    const [selected, setselected] = useState('');

    const radioButtons = useMemo(() => ([
        {
            // acts as primary key, should be unique and non-empty string
            value: 'Liberal',
            label: 'Liberal'
        },
        {

            value: 'Moderative',
            label: 'Moderative'
        },
        {

            value: 'Conservative',
            label: 'Conservative'
        },
        {

            value: 'Non political',
            label: 'Non political'
        },
        {

            value: 'Prefer not to say',
            label: 'Prefer not to say'
        },
    ]), []);



    const handleSelect = (label) => {
        setselected(label)
    }



    // const HandleSelect = (value, profession) => {
    //     if (profession === 'Liberal') {
    //         setDsbMod(true);
    //         setDsbCon(true);
    //         setDsbNon(true);
    //         setDsbPf(true);
    //         setSelected('Libreal')
    //     }
    //     if (profession === 'Moderative') {
    //         setDsbLib(true);
    //         setDsbCon(true);
    //         setDsbNon(true);
    //         setDsbPf(true);
    //         setSelected('Moderative')

    //     }
    //     if (profession === 'Conservative') {
    //         setDsbLib(true);
    //         setDsbMod(true);
    //         setDsbNon(true);
    //         setDsbPf(true);
    //         setSelected('Conservative')

    //     }
    //     if (profession === 'Nonpolitical') {
    //         setDsbLib(true);
    //         setDsbMod(true);
    //         setDsbCon(true);
    //         setDsbPf(true);
    //         setSelected('Nonpolitical')

    //     }
    //     if (profession === 'Prefernottosay') {
    //         setDsbLib(true);
    //         setDsbMod(true);
    //         setDsbCon(true);
    //         setDsbNon(true);
    //         setSelected('Not To Say')

    //     }

    // }

    const handleSubmit = () => {
        if (selected) {
            setLoading(true)
            getPoliticalBelief(selected, ProfileShow).then((res) => {
                console.log(res, 'political');
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
                if(route?.params?.isFrom == 'Main'){
                  navigation.navigate(navigationStrings.RELIGIOUS_BELIEF,{isFrom:'Main'})
                }else{
                 navigation.navigate(navigationStrings.RELIGIOUS_BELIEF,{isFrom:'Auth'})
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
                text: `${'Please Select your Political Belief'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }

    }

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
                <View style={{ flex: 0.9, justifyContent: 'flex-start' }}>
                    <Image source={imagePath.political} style={{ alignSelf: 'center', height: scale(110), width: scale(110) }} />
                    <Text style={styles.phoneHeading}>Political Belief</Text>
                    <Text style={styles.phoneHeading2}>Lorem ipsum dolor sit amet, consect etur adi piscing elit, sed do eiusmod tempor incididunt.</Text>
                    <View style={{ marginVertical: moderateScaleVertical(20) }}>
                        <View style={styles.slidercontainer}>
                        <View style={{}}>
                                    {radioButtons.map((item, index)=>{
                                        return(
                                            <View style={{flexDirection:'row', alignItems:'center', marginRight:10,marginVertical:10}}>
                                            <TouchableOpacity style={{marginRight:5}} onPress={()=>{
                                                handleSelect(item.label)
                                            }}>
                                             <Image style={{height:24, width:24, resizeMode:'contain', tintColor:'#828282'}} source={item.value == selected ?imagePath.radio_select:imagePath.radio_unselect}/>
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

                                    handleSelect(label)

                                }}
                                labelcolor='#828282'
                                buttonSize={15}

                            /> */}
                            {/* <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                <BouncyCheckbox
                                    size={20}
                                    disabled={DsbLib}
                                    disableBuiltInState
                                    isChecked={Liberal}
                                    onPress={(isChecked) => {
                                        HandleSelect(!isChecked, 'Liberal')
                                        setLiberal(true)
                                    }}
                                    unfillColor="#FFFFFF"
                                    fillColor='#005BD4'
                                    text="Liberal"
                                    innerIconStyle={{

                                        borderWidth: 2,
                                        borderColor: '#4F4F4F',
                                        backgroundColor: Liberal ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                    disabled={DsbMod}
                                    disableBuiltInState
                                    isChecked={Moderative}
                                    onPress={(isChecked) => {
                                        HandleSelect(!isChecked, "Moderative")
                                        setModerative(true)
                                    }}
                                    unfillColor="#FFFFFF"
                                    fillColor='#005BD4'
                                    text="Moderative"
                                    innerIconStyle={{

                                        borderWidth: 2,
                                        borderColor: '#4F4F4F',
                                        backgroundColor: Moderative ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                    disabled={DsbCon}
                                    disableBuiltInState
                                    isChecked={Conservative}
                                    onPress={(isChecked) => {
                                        HandleSelect(!isChecked, "Conservative")
                                        setConservative(true)
                                    }}
                                    unfillColor="#FFFFFF"
                                    fillColor='#005BD4'
                                    text="Conservative"
                                    innerIconStyle={{
                                        borderWidth: 2,
                                        borderColor: '#4F4F4F',
                                        backgroundColor: Conservative ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                    disabled={DsbNon}
                                    disableBuiltInState
                                    isChecked={Nonpolitical}
                                    onPress={(isChecked) => {
                                        HandleSelect(!isChecked, "Nonpolitical")
                                        setNonpolitical(true)
                                    }}
                                    unfillColor="#FFFFFF"
                                    fillColor='#005BD4'
                                    text="Non political"
                                    innerIconStyle={{
                                        borderWidth: 2,
                                        borderColor: '#4F4F4F',
                                        backgroundColor: Nonpolitical ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                    disabled={DsbPf}
                                    disableBuiltInState
                                    isChecked={Prefernottosay}
                                    onPress={(isChecked) => {
                                        HandleSelect(!isChecked, "Prefernottosay")
                                        setPrefernottosay(true)
                                    }}
                                    unfillColor="#FFFFFF"
                                    fillColor='#005BD4'
                                    text="Prefer not to say"
                                    innerIconStyle={{
                                        borderWidth: 2,
                                        borderColor: '#4F4F4F',
                                        backgroundColor: Prefernottosay ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
                                    }}
                                    textStyle={{
                                        textDecorationLine: "none",
                                        color: '#4F4F4F',
                                        fontSize: scale(14),
                                        fontWeight: '400',
                                        fontFamily: 'Roboto'
                                    }}
                                />
                            </View> */}

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
                                    if(route?.params?.isFrom == 'Main'){
                                        navigation.navigate(navigationStrings.RELIGIOUS_BELIEF,{isFrom:'Main'})
                                      }else{
                                       navigation.navigate(navigationStrings.RELIGIOUS_BELIEF,{isFrom:'Auth'})
                                    }
                                }}>
                                <Text style={styles.skip}>Skip</Text>
                            </Pressable>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <ButtonComp isLoading={Loading} onPress={handleSubmit} text='Submit' style={{ backgroundColor: '#005BD4' }} />
                        </View>

                    </View>
                </View>
                {/* </KeyboardAwareScrollView> */}
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
        elevation: 3,
        borderRadius: moderateScale(5)
    },
    skip: {
        color: '#4F4F4F',
        fontSize: scale(16),
        fontFamily: 'Roboto',
        fontWeight: '600',
    }


});

//make this component available to the app
export default PoliticalBelief;

//import liraries
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, Pressable,TouchableOpacity } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import TextInputC from '../../Components/TextInputC';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Snackbar from 'react-native-snackbar';
import { getProfession } from '../../API/Api';
import navigationStrings from '../../Navigation/navigationStrings';
import RadioForm from 'react-native-simple-radio-button'
import { useDispatch } from 'react-redux';
import { saveUserData } from '../../redux/Slices/UserSlice';


// create a component
const WhatDo = ({ navigation, route }) => {
    const dispatch = useDispatch();

    const [Student, setStudent] = useState(false)
    const [label, setlabel] = useState('')
    const [Freelancing, setFreelancing] = useState(false)
    const [SalariedJob, setSalariedJob] = useState(false)
    const [Entrepreneur, setEntrepreneur] = useState(false)
    const [ProfileShow, setProfileShow] = useState(false)
    const [Loading, setLoading] = useState(false);




    const [JobProfile, setJobProfile] = useState('')
    const [CompanyName, setCompanyName] = useState('')
    const [Yexp, setYexp] = useState('')

    // const [ETitle, setEtitle] = useState('')
    // const [ECName, setECName] = useState('')


    const [Dsb, setDsb] = useState(false);
    const [DsbUn, setDsbUn] = useState(false);
    const [DsbFree, setDsbFree] = useState(false);
    const [Dsbslry, setDsbslry] = useState(false);
    const [DsbEnt, setDsbEnt] = useState(false);

    const [selected, setselected] = useState('');

    const [value, setvalue] = useState('');
    const radioButtons = useMemo(() => ([
        {
            value: 'Student',
            label: 'Student'
        },
        {

            value: 'Unemployed',
            label: 'Unemployed'
        },
        {

            value: 'Freelancing',
            label: 'Freelancing'
        },
        {

            value: 'Salaried Job',
            label: 'Salaried Job'
        },
        {

            value: 'Entrepreneur',
            label: 'Entrepreneur'
        },
    ]), []);



    const handleSelect = (label) => {
        console.log(label, 'label')
        setlabel(label)
        if (label === 'Student') {
            setJobProfile('')
            setCompanyName('')
            setYexp('')
            setStudent(true)
            setFreelancing(false)
            setSalariedJob(false)
            setEntrepreneur(false)
        }
        if (label === 'Freelancing') {
            setJobProfile('')
            setCompanyName('')
            setYexp('')
            setFreelancing(true)
            setStudent(false);
            setSalariedJob(false)
            setEntrepreneur(false)
        }
        if (label === 'Salaried Job') {
            setJobProfile('')
            setCompanyName('')
            setYexp('')
            setSalariedJob(true)
            setStudent(false);
            setFreelancing(false)
            setEntrepreneur(false)
        }
        if (label === 'Entrepreneur') {
            setJobProfile('')
            setCompanyName('')
            setYexp('')
            setEntrepreneur(true)
            setStudent(false);
            setFreelancing(false)
            setSalariedJob(false)
        }
        if (label === 'Unemployed') {
            setEntrepreneur(false)
            setStudent(false);
            setFreelancing(false)
            setSalariedJob(false)
            setJobProfile('NA')
            setCompanyName('NA')
            setYexp('Unemployed')
        }

    }

    const HandleSelect = (value, profession) => {
        console.log(value, profession);
        if (profession === 'Student') {
            setDsbUn(true);
            setDsbFree(true);
            setDsbslry(true);
            setDsbEnt(true);
        }
        if (profession === 'Unemployed') {
            setDsb(true);
            setDsbFree(true);
            setDsbslry(true);
            setDsbEnt(true);
            setJobProfile('Unemployed')
            setCompanyName('Unemployed')
            setYexp('0')
        }
        if (profession === 'Freelancing') {
            setDsb(true);
            setDsbUn(true);
            setDsbslry(true);
            setDsbEnt(true);
        }
        if (profession === 'Salaried') {
            setDsb(true);
            setDsbUn(true);
            setDsbFree(true);
            setDsbEnt(true);
        }
        if (profession === 'Entrepreneur') {
            setDsb(true);
            setDsbUn(true);
            setDsbFree(true);
            setDsbslry(true);
        }

    }

    const handleSumbit = () => {
        if (JobProfile && CompanyName) {
            setLoading(true)
            getProfession(JobProfile, CompanyName, Yexp).then((res) => {
                console.log(res,'Doing');
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
                    navigation.navigate(navigationStrings.POLITICAL_BELIEF,{isFrom:'Main'})
                  }else{
                   navigation.navigate(navigationStrings.POLITICAL_BELIEF,{isFrom:'Auth'})
                }
                   // navigation.navigate(navigationStrings.POLITICAL_BELIEF)

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
                text: `${'Please Select Work Status'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });

        }

    }
    return (
        <WrapperContainer>
            <View style={styles.container}>
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    <View style={[styles.helpIcon, { justifyContent: 'space-between', }]}>
                        <TouchableOpacity
                            style={{ marginRight: moderateScale(10) }}
                            onPress={() => navigation.goBack()}>
                            <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                        </TouchableOpacity>
                        <Image source={imagePath.help_outline} />
                    </View>
                    <View style={{ flex: 0.9, justifyContent: 'flex-start' }}>
                        <Image source={imagePath.do} style={{ alignSelf: 'center', height: scale(110), width: scale(110) }} />
                        <Text style={styles.phoneHeading}>What do you do?</Text>
                        <Text style={styles.phoneHeading2}>Lorem ipsum dolor sit amet, consect etur adi piscing elit, sed do eiusmod tempor incididunt.</Text>
                        <View style={{ marginVertical: moderateScaleVertical(10) }}>
                            <View style={styles.slidercontainer}>
                            <View style={{}}>
                                    {radioButtons.map((item, index)=>{
                                        return(
                                            <View style={{flexDirection:'row', alignItems:'center', marginRight:10, marginVertical:10}}>
                                            <TouchableOpacity style={{marginRight:5}} onPress={()=>{
                                             handleSelect(item.label)
                                            }}>
                                             <Image style={{height:24, width:24, resizeMode:'contain', tintColor:'#828282'}} source={item.label == label ?imagePath.radio_select:imagePath.radio_unselect}/>
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
                                        disabled={Dsb}
                                        disableBuiltInState
                                        isChecked={Student}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Student')
                                            setStudent(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Student"
                                        innerIconStyle={{

                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Student ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                        disabled={DsbUn}
                                        size={20}
                                        disableBuiltInState
                                        isChecked={Unemployed}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Unemployed')
                                            setUnemployed(true)
                                        }}

                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Unemployed"
                                        innerIconStyle={{

                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Unemployed ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                        disabled={DsbFree}
                                        size={20}
                                        disableBuiltInState
                                        isChecked={Freelancing}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Freelancing')
                                            setFreelancing(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Freelancing"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Freelancing ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                        disabled={Dsbslry}
                                        size={20}
                                        disableBuiltInState
                                        isChecked={SalariedJob}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Salaried')
                                            setSalariedJob(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Salaried Job"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: SalariedJob ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                                        disabled={DsbEnt}
                                        size={20}
                                        disableBuiltInState
                                        isChecked={Entrepreneur}
                                        onPress={(isChecked) => {
                                            HandleSelect(!isChecked, 'Entrepreneur')
                                            setEntrepreneur(true)
                                        }}
                                        unfillColor="#FFFFFF"
                                        fillColor='#005BD4'
                                        text="Entrepreneur"
                                        innerIconStyle={{
                                            borderWidth: 2,
                                            borderColor: '#4F4F4F',
                                            backgroundColor: Entrepreneur ? "#4F4F4F" : 'white' // to make it a little round increase the value accordingly
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
                        {
                            Student && 
                            <View>
                                <Text style={[styles.skip, { fontSize: scale(14), marginBottom: moderateScaleVertical(5) }]}>Student Information</Text>
                                <TextInputC
                                    placeholder={'Name of University/Institute'}
                                    value={JobProfile}
                                    editable={true}
                                    onChangeText={(text) => setJobProfile(text)}
                                />
                                <TextInputC style={{ marginVertical: moderateScale(3) }}
                                    placeholder={'Degree'}
                                    value={CompanyName}
                                    editable={true}
                                    onChangeText={(text) => setCompanyName(text)}
                                />
                            </View>
                        }

                        {
                            Freelancing && <View>
                                <Text style={[styles.skip, { fontSize: scale(14), marginBottom: moderateScaleVertical(5) }]}>Freelancing Information</Text>
                                <TextInputC
                                    placeholder={'Enter your Job Profile'}
                                    value={JobProfile}
                                    editable={true}
                                    onChangeText={(text) => setJobProfile(text)}
                                />
                                <TextInputC style={{ marginVertical: moderateScale(3) }}
                                    placeholder={'Years of Experience'}
                                    value={CompanyName}
                                    editable={true}
                                    onChangeText={(text) => setCompanyName(text)}
                                />
                            </View>
                        }

                        {
                            SalariedJob &&
                            <View>
                                <Text style={[styles.skip, { fontSize: scale(14), marginBottom: moderateScaleVertical(5) }]}>Salaried Job Information</Text>
                                <TextInputC
                                    placeholder={'Enter your Job Profile'}
                                    value={JobProfile}
                                    editable={true}
                                    onChangeText={(text) => setJobProfile(text)}
                                />
                                <TextInputC style={{ marginVertical: moderateScale(3) }}
                                    placeholder={'Name of your company'}
                                    value={CompanyName}
                                    editable={true}
                                    onChangeText={(text) => setCompanyName(text)}
                                />
                                <TextInputC style={{ marginVertical: moderateScale(3) }}
                                    placeholder={'Years of Experience'}
                                    value={Yexp}
                                    editable={true}
                                    onChangeText={(text) => setYexp(text)}
                                />
                            </View>
                        }
                        {
                            Entrepreneur && <View>
                                <Text style={[styles.skip, { fontSize: scale(14), marginBottom: moderateScaleVertical(5) }]}>Entrepreneur Information</Text>
                                <TextInputC
                                    placeholder={'Title'}
                                    editable={true}
                                    value={JobProfile}
                                    onChangeText={(text) => setJobProfile(text)}
                                />
                                <TextInputC style={{ marginVertical: moderateScale(3) }}
                                    placeholder={'Name of your company'}
                                    value={CompanyName}
                                    editable={true}
                                    onChangeText={(text) => setCompanyName(text)}
                                />

                            </View>
                        }

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
                                            navigation.navigate(navigationStrings.POLITICAL_BELIEF,{isFrom:'Main'})
                                          }else{
                                           navigation.navigate(navigationStrings.POLITICAL_BELIEF,{isFrom:'Auth'})
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
export default WhatDo;

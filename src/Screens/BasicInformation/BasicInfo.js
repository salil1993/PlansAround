//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, PermissionsAndroid, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import TextInputC from '../../Components/TextInputC';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import { AUTH_CONFIG } from '../../constants/Path';
import { getData } from '../../utils/helperFunctions';
import Snackbar from 'react-native-snackbar';
import navigationStrings from '../../Navigation/navigationStrings';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserData } from '../../redux/Slices/UserSlice';

// create a component
const BasicInfo = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [FirstName, setFirstName] = useState('')
  const [LastName, setLastName] = useState('')
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [DOB, setDOB] = useState('');
  const [color, setcolor] = useState(false)
  const [UserPic, setUserpic] = useState([])
  const [Loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date())
  const user = useSelector((state) => state?.persistedReducer?.authSlice?.userData);
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  useEffect(() => {
    if (user) {
      setFirstName(user?.firstName)
      setLastName(user?.lastName)
      if (user?.dateOfBirth) {
        const dt = new Date(user?.dateOfBirth);
        const x = dt.toISOString().split('T');
        const x1 = x[0].split('-');
        const FDate = x1[0] + '-' + x1[1] + '-' + x1[2]
        setDOB(FDate)
      }
    }
  }, [])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("DATA=====", date);
    const dt = new Date(date);
    console.log("DATA1111=====", dt);

    setCurrentDate(dt)
    const x = dt.toISOString().split('T');
    const x1 = x[0].split('-');
    const FDate = x1[0] + '-' + x1[1] + '-' + x1[2]
    setDOB(FDate)
    hideDatePicker()
  }



  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    if (isCameraPermitted) {
      launchCamera(options, (response) => {
        // console.log('Response = ', response.assets);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setUserpic(response?.assets);
        // console.log(UserPic[0]?.fileName, 'UserImage')
      });
    }
  };

  const handleSumbit = async () => {
    if (DOB && FirstName && LastName) {
      setLoading(true);
      const formData = new FormData();
      formData.append('firstName', FirstName)
      formData.append('lastName', LastName)
      formData.append('dateOfBirth', DOB)
      if (UserPic.length && UserPic[0]) {
        formData.append("image", {
          uri: UserPic[0]?.uri,
          type: UserPic[0]?.type, // Modify the type based on your image type
          name: UserPic[0]?.fileName,
          fileName: UserPic[0]?.fileName,
        });
      }
      console.log(formData, 'formdata')
      let usertoken = await getData('UserToken');
      console.log('usertoken====', usertoken);
      const headers = {
        'Authorization': `Bearer ${usertoken}`,
        'Content-Type': 'multipart/form-data',
      };

      axios.post('https://plansaround-backend.vercel.app/api/mobile/registration/basic-inforamtion', formData, { headers })
        .then((res) => {
          console.log(res, 'basic info');
          setLoading(false);
          const data = res.data.user;
          dispatch(saveUserData(data));
          Snackbar.show({
            text: `${res.data.message}`,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: '#005BD4',
            textColor: "#fff",
          });
          // setTimeout(() => {
          // Snackbar.dismiss();
          console.log('Params-->>', route?.params?.isFrom)
          if (route?.params?.isFrom == 'Main') {
            navigation.navigate(navigationStrings.SET_LOCATION, { isFrom: 'Main' })
          } else {
            navigation.navigate(navigationStrings.SET_LOCATION, { isFrom: 'Auth' })
          }
          // navigation.navigate(navigationStrings.SET_LOCATION)
          // }, 2000)
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          Snackbar.show({
            text: `${error.response.data.message}`,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'red',
            textColor: "#fff",
          });
        });

    } else {
      Snackbar.show({
        text: `${'Please Enter Name,FullName and DateOfBirth'}`,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
        textColor: "#fff",
      });

    }






    // BasicInformation(formData)
    // .then((res)=>console.log(res))
    // .catch((err)=>console.log(err,'err'))
    // navigation.navigate(navigationStrings.SET_LOCATION)
    // let res = await fetch(
    //   AUTH_CONFIG.BASE_URL+'/basic-inforamtion',
    //   {
    //     method: 'post',
    //     body: JSON.stringify(formData),
    //     headers: {
    //       'Authorization':'Bearer' + usertoken,
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   }
    // );
    // let resposeJson=await res.json();
    // console.log(res,'ye aaya');
  }
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
            <View style={{ flex: 0.9, justifyContent: 'flex-start' }}>
              <TouchableOpacity onPress={() => captureImage('photo')}>
                {UserPic[0] ? <Image source={{ uri: UserPic[0]?.uri }} style={{ alignSelf: 'center', height: scale(160), width: scale(160), borderRadius: moderateScale(80) }} /> :
                  <Image source={imagePath.Gola} style={{ alignSelf: 'center', height: scale(120), width: scale(120) }} />}
                <Image source={imagePath.plus} style={{ alignSelf: 'center', height: scale(40), width: scale(40), position: 'absolute', bottom: 0, left: moderateScale(115) }} />
              </TouchableOpacity>
              <Text style={styles.phoneHeading}>Basic Information</Text>
              <Text style={styles.phoneHeading2}>Lorem ipsum dolor sit amet, consect etur adi piscing elit, sed do eiusmod tempor incididunt.</Text>
              <View style={{ marginVertical: moderateScaleVertical(10) }}>
                <TextInputC placeholder='First Name'
                  value={FirstName}
                  editable={true}
                  onChangeText={(text) => setFirstName(text)}
                />
                <View style={{ marginTop: moderateScaleVertical(10) }}>
                  <TextInputC placeholder='Last Name'
                    value={LastName}
                    editable={true}
                    onChangeText={(text) => setLastName(text)}
                  />
                </View>
                <View style={{ marginVertical: moderateScaleVertical(10) }}>
                  <TextInputC placeholder={'Date of Birth (DD/MM/YYYY)'}
                    imgsrc={imagePath.calendar}
                    imgright={true}
                    onPress={showDatePicker}
                    onPressSecure={showDatePicker}
                    editable={false}
                    value={DOB}
                  />
                </View>
              </View>
              {isDatePickerVisible && <DateTimePickerModal
                date={currentDate}
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                maximumDate={eighteenYearsAgo}
                timeZoneOffsetInMinutes={0}
              />}
              <ButtonComp isLoading={Loading} onPress={handleSumbit} text='Submit'
                style={{ backgroundColor: color ? '#005BD4' : '#828282', marginVertical: moderateScaleVertical(10) }} />
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

});

//make this component available to the app
export default BasicInfo;

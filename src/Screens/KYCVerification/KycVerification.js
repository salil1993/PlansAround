//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, PermissionsAndroid, TouchableOpacity, Pressable } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import { Dropdown } from 'react-native-element-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import { getData } from '../../utils/helperFunctions';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import { AUTH_CONFIG } from '../../constants/Path';
import { useDispatch } from 'react-redux/es/exports';
import { saveUserData, userStatus } from '../../redux/Slices/UserSlice';
import { useSelector } from 'react-redux'
// create a component
const KycVerification = ({ navigation }) => {
  const [mainData, setmainData] = useState();



  const dispatch = useDispatch();
  const [ProfileShow, setProfileShow] = useState(false);
  const [value, setValue] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [SnapFrontID, setSnapFrontID] = useState([]);
  const [SnapBackID, setSnapBackID] = useState([]);
  const [SnapFrontUploadID, setSnapUploadID] = useState([]);
  const [SnapBackUploadID, setSnapBackUploadID] = useState([]);
  const [Selfie, setSelfie] = useState([]);
  const [Loading, setLoading] = useState(false);

  const [FrontSelected, setFrontSelected] = useState();
  const [BackSelected, setBackSelected] = useState();
  const [btn, setbtn] = useState(false)

  const [ChkSnapFrontID, setChkSnapFrontID] = useState(false)
  const [ChkSnapFrontUploadID, setChkSnapFrontUploadID] = useState(false)
  const [ChkSnapBackID, setChkSnapBackID] = useState(false)
  const [ChkSnapBackUploadID, setChkSnapBackUploadID] = useState(false)
  const [chkSelfie, setchkSelfie] = useState(false);

  const data = [
    { label: 'Driving License', value: '1' },
    { label: 'Passport', value: '2' },
    { label: 'Health Insurance Card', value: '3' },
    { label: 'The Electronic Identity Card (CIE)', value: '4' },
    { label: 'Italian identity card', value: '5' },
    { label: 'Permesso di soggiorno', value: '6' },
  ];
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

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type, id) => {
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
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted) {
      launchCamera(options, (response) => {
        console.log('Response = ', response.assets);
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
        if (id === 1) {
          console.log(id)
          setSnapFrontID(response?.assets);
          setFrontSelected(response?.assets);
          console.log(SnapFrontID[0]?.fileName, 'IDfront')
          setChkSnapFrontID(true)
        } else if (id === 5) {

          console.log(id)
          setSelfie(response?.assets);
          console.log(Selfie[0]?.fileName, 'Selfie')
          setchkSelfie(true)
        } else {
          console.log(id)
          setSnapBackID(response?.assets);
          setBackSelected(response?.assets)
          console.log(SnapBackID[0]?.fileName, 'ID Back')
          setChkSnapBackID(true)
        }
      });


    }
  };

  const chooseFile = (type, id) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

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
      if (id === 2) {
        setSnapUploadID(response?.assets);
        setFrontSelected(response?.assets)
        console.log(SnapFrontUploadID[0]?.fileName, 'upload1')
        setChkSnapFrontUploadID(true)
      } else {
        setSnapBackUploadID(response?.assets);
        setBackSelected(response?.assets)
        console.log(SnapBackUploadID[0]?.fileName, 'upload2')
        setChkSnapBackUploadID(true)
      }

    });
  };


  const handleSelectoption = (item) => {
    setValue(item.label);
    setbtn(true)
  }

  const handleSumbit = async () => {
    // if(kycdoc && )
    const kycdoc = value.label;

    setLoading(true);
    const formData = new FormData();
    formData.append('doc_type', kycdoc)
    formData.append("front", {
      uri: FrontSelected[0]?.uri,
      type: FrontSelected[0]?.type, // Modify the type based on your image type
      name: FrontSelected[0]?.fileName,
      fileName: FrontSelected[0]?.fileName,
    });
    formData.append("back", {
      uri: BackSelected[0]?.uri,
      type: BackSelected[0]?.type, // Modify the type based on your image type
      name: BackSelected[0]?.fileName,
      fileName: BackSelected[0]?.fileName,
    });
    formData.append("selfie", {
      uri: Selfie[0]?.uri,
      type: Selfie[0]?.type, // Modify the type based on your image type
      name: Selfie[0]?.fileName,
      fileName: Selfie[0]?.fileName,
    });


    let usertoken = await getData('UserToken');
    console.log(usertoken, 'token')
    const headers = {
      'Authorization': `Bearer ${usertoken}`,
      'Content-Type': 'multipart/form-data',
    };

    axios.post(AUTH_CONFIG.BASE_URL + '/kyc-verification', formData, { headers })
      .then((res) => {
        console.log(res);
        const data = res.data.user;
        setmainData(data);

        setLoading(false);
        Snackbar.show({
          text: `${res.data.message}`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#005BD4',
          textColor: "#fff",
        });

        // setTimeout(() => {
        dispatch(userStatus(true))
        dispatch(saveUserData(data))
        console.log('Data gya')
        Snackbar.dismiss();
        // navigation.navigate(navigationStrings.TABROUTES)
        // navigation.navigate(navigationStrings.EMAIL_VERIFY)
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








    // navigation.navigate(navigationStrings.TABROUTES)

  }
  return (
    <WrapperContainer>
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
          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <Image source={imagePath.kyc} style={{ alignSelf: 'center', height: scale(100), width: scale(100) }} />
            <Text style={styles.phoneHeading}>KYC Verification</Text>
            <Text style={styles.phoneHeading2}>Upload 2 sides of your proof of identity and selfie with it for verification purpose</Text>
            <Text style={[styles.phoneHeading2, { color: '#005BD4', fontWeight: '700', textAlign: 'center' }]}>A Verified Profile gets accepted 5 times more easily, Do your verification Now!</Text>
            <KeyboardAwareScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <View style={{ marginVertical: moderateScaleVertical(5), backgroundColor: 'white', padding: moderateScale(8), borderRadius: scale(5) }}>
                <Dropdown
                  style={[styles.dropdown]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={{
                    width: 30,
                    height: 30,
                  }}
                  data={data}
                  itemTextStyle={styles.itemTextStyle}
                  containerStyle={{}}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Choose a proof of identity' : 'Please select'}
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    // console.log(item);
                    handleSelectoption(item)
                    setValue(item);
                    setIsFocus(false);
                  }}
                />
              </View>
              <View>
                <Text style={styles.Id}>Submit an ID (Front)</Text>
                <View style={[styles.Idfront]}>
                  <TouchableOpacity onPress={() => captureImage('photo', 1)} style={{ backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: scale(10), borderRadius: scale(5), flex: 0.5 }}>
                    <Image source={imagePath.camera} style={{ height: scale(30), width: scale(30) }} />
                    <Text style={styles.snapshot}>{SnapFrontID[0]?.fileName ? SnapFrontID[0]?.fileName.slice(55, 65) : 'Snapshot'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => chooseFile('photo', 2)} style={{ backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: scale(10), borderRadius: scale(5), flex: 0.5, marginLeft: scale(5) }}>
                    <Image source={imagePath.arrowup} style={{ height: scale(30), width: scale(30) }} />
                    <Text style={styles.snapshot}>{SnapFrontUploadID[0]?.fileName ? SnapFrontUploadID[0]?.fileName.slice(5, 14) : 'Upload'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  {ChkSnapFrontID &&
                    SnapFrontID && SnapFrontID.map((item, index) => {
                      // console.log(item, 'img...')
                      return (
                        <View key={index} style={{ marginHorizontal: moderateScale(10) }}>
                          <Image source={{ uri: item.uri }} style={{ height: moderateScale(150), width: moderateScale(150), marginVertical: moderateScaleVertical(5), borderRadius: moderateScale(5), borderColor: '#fff', borderWidth: moderateScale(5) }} resizeMode='cover' />
                        </View>
                      )
                    })
                  }
                </View>
                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  {ChkSnapFrontUploadID &&
                    SnapFrontUploadID && SnapFrontUploadID.map((item, index) => {
                      // console.log(item, 'img...')
                      return (
                        <View key={index} style={{ marginHorizontal: moderateScale(10) }}>
                          <Image source={{ uri: item.uri }} style={{ height: moderateScale(150), width: moderateScale(150), marginVertical: moderateScaleVertical(5), borderRadius: moderateScale(5), borderColor: '#fff', borderWidth: moderateScale(5) }} resizeMode='cover' />
                        </View>
                      )
                    })
                  }
                </View>
              </View>
              <View>
                <Text style={styles.Id}>Submit an ID (Back)</Text>
                <View style={styles.Idfront}>
                  <TouchableOpacity onPress={() => captureImage('photo', 3)} style={{ backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: scale(10), borderRadius: scale(5), flex: 0.5 }}>
                    <Image source={imagePath.camera} style={{ height: scale(30), width: scale(30) }} />
                    <Text style={styles.snapshot}>{SnapBackID[0]?.fileName ? SnapBackID[0]?.fileName.slice(55, 65) : 'Snapshot'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => chooseFile('photo', 4)} style={{ backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: scale(10), borderRadius: scale(5), flex: 0.5, marginLeft: scale(5) }}>
                    <Image source={imagePath.arrowup} style={{ height: scale(30), width: scale(30) }} />
                    <Text style={styles.snapshot}>{SnapBackUploadID[0]?.fileName ? SnapBackUploadID[0]?.fileName.slice(5, 14) : 'Upload'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  {ChkSnapBackUploadID &&
                    SnapBackUploadID && SnapBackUploadID.map((item, index) => {
                      // console.log(item, 'img...')
                      return (
                        <View key={index} style={{ marginHorizontal: moderateScale(10) }}>
                          <Image source={{ uri: item.uri }} style={{ height: moderateScale(150), width: moderateScale(150), marginVertical: moderateScaleVertical(5), borderRadius: moderateScale(5), borderColor: '#fff', borderWidth: moderateScale(5) }} resizeMode='cover' />
                        </View>
                      )
                    })
                  }
                </View>
                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  {ChkSnapBackID &&
                    SnapBackID && SnapBackID.map((item, index) => {
                      // console.log(item, 'img...')
                      return (
                        <View key={index} style={{ marginHorizontal: moderateScale(10) }}>
                          <Image source={{ uri: item.uri }} style={{ height: moderateScale(150), width: moderateScale(150), marginVertical: moderateScaleVertical(5), borderRadius: moderateScale(5), borderColor: '#fff', borderWidth: moderateScale(5) }} resizeMode='cover' />
                        </View>
                      )
                    })
                  }
                </View>
              </View>
              <View>
                <Text style={[styles.Id, { marginVertical: moderateScaleVertical(5) }]}>Upload a selfie</Text>
                <View style={{
                  justifyContent: 'center', alignItems: 'center', borderRadius: scale(5),
                  backgroundColor: '#4F4F4F', paddingVertical: moderateScaleVertical(10)
                }}>
                  <TouchableOpacity onPress={() => captureImage('photo', 5)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={imagePath.camera} tintColor={'#fff'} />
                    <Text style={{ color: '#E0E0E0', fontFamily: 'Roboto', fontSize: scale(16), fontWeight: '600' }}>{Selfie[0]?.fileName ? Selfie[0]?.fileName.slice(45, 65) : 'Take a selfie with the ID'}</Text>
                  </TouchableOpacity>
                  <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                    {chkSelfie &&
                      Selfie && Selfie.map((item, index) => {
                        // console.log(item, 'img...')
                        return (
                          <View key={index} style={{ marginHorizontal: moderateScale(10) }}>
                            <Image source={{ uri: item.uri }} style={{ height: moderateScale(150), width: moderateScale(150), marginVertical: moderateScaleVertical(5), borderRadius: moderateScale(5), borderColor: '#fff', borderWidth: moderateScale(5) }} resizeMode='cover' />
                          </View>
                        )
                      })
                    }
                  </View>
                </View>
              </View>
              <View style={{ marginVertical: moderateScaleVertical(10), }}>
                {/* <BouncyCheckbox
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
                /> */}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 0.3, alignItems: 'center' }}>
                  <Pressable
                    android_ripple={{ color: 'red', borderless: true, radius: moderateScale(25), }}
                    onPress={() => {
                      dispatch(userStatus(true))
                      // dispatch(saveUserData(mainData))
                      // console.log('Data gya')
                      // dispatch(saveUserData(data))
                    }}>
                    <Text style={styles.skip}>Skip</Text>
                  </Pressable>
                </View>
                <View style={{ flex: 0.7 }}>
                  <ButtonComp isLoading={Loading} onPress={handleSumbit} text='Submit' style={{ backgroundColor: '#005BD4' }} />
                </View>
              </View>
              {/* <View>
                <ButtonComp isLoading={Loading} onPress={handleSumbit} text='Submit' style={{ backgroundColor:  '#005BD4' }} />
              </View> */}
            </KeyboardAwareScrollView>
          </View>
        </View>
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
    color: '#333'
  },
  phoneHeading2: {
    fontSize: scale(14),
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#4F4F4F',
    marginTop: moderateScaleVertical(5)
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
  placeholderStyle: {
    color: '#828282',
    fontFamily: 'Roboto',
    fontSize: scale(15),
    fontWeight: '500',
  },
  selectedTextStyle: {
    color: '#828282',
    fontFamily: 'Roboto',
    fontSize: scale(16),
    fontWeight: '700',
  },
  itemTextStyle: {
    color: '#828282',
    fontFamily: 'Roboto',
    fontSize: scale(16),
    fontWeight: '700'

  },
  Id: {
    color: "#4F4F4F",
    fontSize: scale(14),
    fontFamily: 'Roboto',
    fontWeight: '700'
  },
  Idfront: {
    backgroundColor: 'E0E0E0',
    padding: moderateScale(8),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: scale(5)
  },
  snapshot: {
    color: '#828282',
    fontFamily: 'Roboto',
    fontSize: scale(16),
    fontWeight: '600',
    marginLeft: moderateScale(8)
  },
  skip: {
    color: '#4F4F4F',
    fontSize: scale(16),
    fontFamily: 'Roboto',
    fontWeight: '600',
  },


});

//make this component available to the app
export default KycVerification;

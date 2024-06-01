//import liraries
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, Alert, StatusBar, TouchableOpacity, Platform, PermissionsAndroid, } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale, height, textScale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import TextInputC from '../../Components/TextInputC';
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import HeaderBack from '../../Components/HeaderBack';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-native-modal'
import moment from "moment";
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import { AUTH_CONFIG } from '../../constants/Path';
import axios from 'axios';
import { getData } from '../../utils/helperFunctions';
import Snackbar from 'react-native-snackbar';
import SearchPlaces from '../../Components/SearchPlaces';
import navigationStrings from '../../Navigation/navigationStrings';
import RadioForm from 'react-native-simple-radio-button'





// create a component
const EditEvent = ({ navigation, route }) => {

    useEffect(() => {
        getCategoryData();
    }, [])

    const getCategoryData = async () => {
        let usertoken = await getData('UserToken');
        // console.log(usertoken, 'api m');
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        axios.get('https://plansaround-backend.vercel.app/api/mobile/category/', { headers })
            .then((res) => {
                console.log(res, 'cataaya in EditEvent')
                setCategoryList(res.data.categories);
                // setCategoryList(res.data)
            })
            .catch((err) => console.log(err, 'cat m err'))
    }
    const getSubCategoryData = async (CategoryId) => {
        let usertoken = await getData('UserToken');
        // console.log(usertoken, 'api m');
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        axios.get(`https://plansaround-backend.vercel.app/api/mobile/category/${CategoryId}/subcategory`, { headers })
            .then((res) => {
                console.log(res, 'subCategory aaya idehr in EditEvent')
                setSubCategoryList(res.data.subCategories)
                // setCategoryList(res.data.categories);
                // setCategoryList(res.data)
            })
            .catch((err) => console.log(err, 'subcat m err'))
    }
    const dispatch = useDispatch();
    const Eventdata = route?.params.data;
    console.log(Eventdata, 'eventdatanew')
    let date = Eventdata.dateOfEvent.split('T');
    // console.log(Eventdata, 'route')
    const [EventName, setEventName] = useState(Eventdata.name);
    const [Description, setDescription] = useState(Eventdata.description);
    const [MxPeople, setMxPeople] = useState(`${Eventdata.maxPeople}`);
    const [MnPeople, setMnPeople] = useState(`${Eventdata.minPeople}`);
    const [DOB, setDOB] = useState(date[0]);
    const [startTime, setstartTime] = useState(`${Eventdata.time.start}`);
    const [EndTime, setEndTime] = useState(`${Eventdata.time.end}`);
    const [latitude, setlatitude] = useState(Eventdata.location.latitude)
    const [longitude, setlongitude] = useState(Eventdata.location.longitude)

    // const [LocationAddress, setLocationAddress] = useState('')
    // const [FullAddress, setFullAdress] = useState(`${Eventdata.address.fullAddress}`)
    // const [ApartMent, setApartMent] = useState(`${Eventdata.address.houseNumber}`);
    // const [State, setState] = useState(`${Eventdata.address.state}`);

    // const [Street, setStreet] = useState(`${Eventdata.address.street}`);
    // const [City, setCity] = useState(`${Eventdata.address.city}`);
    // const [Zip, setZip] = useState(`${Eventdata.address.zipcode}`);
    const [value, setValue] = useState('');
    const [openModal, setopenModal] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isStartTime, setisStartTime] = useState(false);
    const [isEndTime, setisEndTime] = useState(false);


    const [Uplaod, setUpload] = useState([]);
    const [gallery, setgallery] = useState([Eventdata.images]);
    const [Newgallery, setNewgallery] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [local, setlocal] = useState(true);
    const [selected, setselected] = useState(Eventdata.participantType);

    const [CategoryList, setCategoryList] = useState([]);
    const [SubCategoryList, setSubCategoryList] = useState([]);
    const [SelectedCategory, setSelectedCategory] = useState('')
    const [SelectedsubCategory, setSelectedsubCategory] = useState('')
    const [address, setAddress] = useState(Eventdata.address);
    const [amount, setamount] = useState(`${Eventdata.amount}`);
    const [visiblePaid, setvisiblePaid] = useState(true);




    // console.log(latitude, '..', longitude, '...', selected, '....', value)
    const radioButtons = useMemo(() => ([
        {
            // acts as primary key, should be unique and non-empty string
            value: 'Verified Only',
            label: 'Verified Only'
        },
        {

            value: 'All',
            label: 'All'
        },
    ]), []);



    // useEffect(() => {
    //     setSelectedCategory(Eventdata.category.name)
    //     console.log('item set')
    // }, [])
    const handleSelect = (label) => {
        if (label === 'Other') {
            setselected('')

        } else {
            setselected(label)
        }

    }

    const reverseGeocode = async (latitude, longitude) => {
        console.log(latitude, '...', longitude, 'revrsecode called')
        const apiKey = 'AIzaSyBWnqaUowVdjnPVHJAdLf0MMBgQRm6NMpc';
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            // console.log(data, 'addrress')

            if (data.results && data.results.length > 0) {
                const formattedAddress = data.results[0].formatted_address;
                console.log(formattedAddress, 'reversecoding m')
                setAddress(formattedAddress);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const onSearchhandle = (data, details) => {
        console.log(details.geometry.location, 'NewLocationyhaHostEvent m')
        const selectedLocation = details.geometry.location;
        const { lat, lng } = selectedLocation;
        console.log(lat, '...', lng)
        const latitude = lat;
        const longitude = lng;
        setlatitude(latitude);
        setlongitude(longitude);
        reverseGeocode(latitude, longitude);
    }

    const handleSubmit = () => {
        console.log('FreeSubmmit called')
        setopenModal(true);
    }
    const handlePaidSubmit = () => {
        console.log('paidSubmmit called')
        setopenModal(true);
    }
    const handleSelectCategory = (item) => {
        console.log(item, 'category')
        // setCategory(item);
        setSelectedCategory(item.label)
    }


    const handleSelectSubCategory = (item) => {
        // setSubCategory(item);
        setSelectedsubCategory(item.label);
    }
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const showStartTime = () => {
        setisStartTime(!isStartTime);
    };
    const showStartTime2 = () => {
        setisEndTime(!isEndTime);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const hidestartTimePicker = () => {
        setisStartTime(false);
    };
    const hidestartTimePicker2 = () => {
        setisEndTime(false)
    };

    const handleConfirm = (date) => {
        const dt = new Date(date);
        const x = dt.toISOString().split('T');
        const x1 = x[0].split('-');
        const FDate = x1[0] + '-' + x1[1] + '-' + x1[2]
        setDOB(FDate)
        hideDatePicker();
    }
    const handletime = (date) => {
        const dt = new Date(date);
        let tzTime = dt.toLocaleTimeString()
        let newTime = tzTime.split(':')
        // console.log(typeof(newTime[2]));
        let Dformat = newTime[2]
        // let value = newTime.map(function (str) {
        //     return str.substring(2);
        // });
        // console.log(value,'new')
        let Finaltime = newTime[0] + ':' + newTime[1] + ' ' + Dformat.substring(3, 5).toUpperCase();
        console.log(Finaltime, 'ye start time hai')

        setstartTime(Finaltime);
    }
    const handletime2 = (date) => {
        const dt = new Date(date);
        let tzTime = dt.toLocaleTimeString()
        let newTime = tzTime.split(':')
        let Dformat = newTime[2]
        // let value = newTime.map(function (str) {
        //     return str.substring(2);
        // });
        // console.log(value,'new')
        let Finaltime = newTime[0] + ':' + newTime[1] + ' ' + Dformat.substring(3, 5).toUpperCase();
        setEndTime(Finaltime);
        console.log(Finaltime, 'ye Endtime time hai')
        setisEndTime(false);
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

    const captureImage = async (type,) => {
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
        // let isStoragePermitted = await requestExternalWritePermission();
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
                setUpload(response?.assets)
                console.log(Uplaod, 'ye aaya')


                // if (id === 1) {
                //   console.log(id)
                //   setSnapFrontID(response?.assets);
                //   setFrontSelected(response?.assets);
                //   console.log(SnapFrontID[0]?.fileName, 'IDfront')
                // } else if (id === 5) {

                //   console.log(id)
                //   setSelfie(response?.assets);
                //   console.log(Selfie[0]?.fileName, 'Selfie')
                // } else {
                //   console.log(id)
                //   setSnapBackID(response?.assets);
                //   setBackSelected(response?.assets)
                //   console.log(SnapBackID[0]?.fileName, 'ID Back')
                // }
            });


        }
    };


    const chooseFile = (type) => {
        let options = {
            mediaType: type,
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            selectionLimit: 5,
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
            setNewgallery(response?.assets)
            setlocal(false)
        });
    };


    const handleCreateEvent = async () => {
        // reverseGeocode(latitude, longitude);
        console.log(address, 'address')
        if (SelectedCategory && SelectedsubCategory) {
            setLoading(true);
            console.log(EventName, 'activity')
            console.log(Description, 'description')
            console.log(MxPeople, 'maxpple')
            console.log(MnPeople, 'minpple')
            console.log(DOB, 'EventDate')
            console.log(startTime, 'starttime')
            console.log(EndTime, 'Endtime')
            console.log(latitude, 'latitude')
            console.log(longitude, 'longitude')
            console.log(selected, 'participation')

            console.log(Newgallery, 'yegallehg');
            console.log(address, 'address');

            const formData = new FormData();
            formData.append('name', EventName);
            formData.append('description', Description);
            formData.append('maxPeople', MxPeople);
            formData.append('minPeople', MnPeople);
            formData.append('dateOfEvent', DOB);
            formData.append('timeStart', startTime);
            formData.append('timeEnd', EndTime);

            Newgallery?.forEach((image, index) => {
                // console.log(image.uri, 'image')
                formData.append(`images`, {
                    uri: image.uri,
                    type: image.type,
                    name: image.fileName || `image_${index}.jpg`,
                });
            })

            formData.append('latitude', latitude);
            formData.append('longitude', longitude);
            formData.append('participantType', selected);
            formData.append('category', SelectedCategory.value,);
            formData.append('subCategory', SelectedsubCategory.value,);
            formData.append('address', address);


            console.log(formData, 'formdata')

            let usertoken = await getData('UserToken');
            console.log(usertoken, 'token')
            const headers = {
                'Authorization': `Bearer ${usertoken}`,
                'Content-Type': 'multipart/form-data',
            };

            axios.put(AUTH_CONFIG.EVENT_URL + `/edit-event/${Eventdata._id}`, formData, { headers })
                .then((res) => {
                    console.log(res, 'resUpdatedevent');
                    setLoading(false);
                    Snackbar.show({
                        text: `${res.data.message}`,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: '#005BD4',
                        textColor: "#fff",
                    });
                    setEventName('');
                    setDescription('');
                    setMnPeople('');
                    setMxPeople('');
                    setDOB('');
                    setstartTime('');
                    setEndTime('');
                    setlongitude('');
                    setlatitude('');
                    setopenModal(false)
                    navigation.navigate(navigationStrings.HOME)
                    Snackbar.dismiss();
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
                text: `${'Please Select the Location, Category & SubCategory again.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }
    }
    const handlepaidCreate = async () => {
        console.log('editPaid running')
        // reverseGeocode(latitude, longitude);
        if (SelectedCategory && SelectedsubCategory) {
            setLoading(true);
            console.log(EventName, 'activity')
            console.log(Description, 'description')
            console.log(MxPeople, 'maxpple')
            console.log(MnPeople, 'minpple')
            console.log(DOB, 'EventDate')
            console.log(startTime, 'starttime')
            console.log(EndTime, 'Endtime')
            console.log(latitude, 'latitude')
            console.log(longitude, 'longitude')
            console.log(selected, 'participation')

            console.log(Newgallery, 'yegallehg');
            console.log(amount, 'amount')
            console.log(address, 'address');


            const formData = new FormData();
            formData.append('name', EventName);
            formData.append('description', Description);
            formData.append('maxPeople', MxPeople);
            formData.append('minPeople', MnPeople);
            formData.append('dateOfEvent', DOB);
            formData.append('timeStart', startTime);
            formData.append('timeEnd', EndTime);

            Newgallery?.forEach((image, index) => {
                console.log(image.uri, 'image')
                formData.append(`images`, {
                    uri: image.uri,
                    type: image.type,
                    name: image.fileName || `image_${index}.jpg`,
                });
            })

            formData.append('latitude', latitude);
            formData.append('longitude', longitude);
            formData.append('participantType', selected);
            formData.append('category', SelectedCategory.value,);
            formData.append('subCategory', SelectedsubCategory.value,);
            formData.append('address', address);
            formData.append('amount', amount);


            console.log(formData, 'formdata')

            let usertoken = await getData('UserToken');
            console.log(usertoken, 'token')
            const headers = {
                'Authorization': `Bearer ${usertoken}`,
                'Content-Type': 'multipart/form-data',
            };

            axios.put(AUTH_CONFIG.EVENT_URL + `/edit-event/${Eventdata._id}`, formData, { headers })
                .then((res) => {
                    console.log(res, 'resUpdatedevent');
                    setLoading(false);
                    Snackbar.show({
                        text: `${res.data.message}`,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: '#005BD4',
                        textColor: "#fff",
                    });
                    setEventName('');
                    setDescription('');
                    setMnPeople('');
                    setMxPeople('');
                    setDOB('');
                    setstartTime('');
                    setEndTime('');
                    setlongitude('');
                    setlatitude('');
                    setopenModal(false)
                    navigation.navigate(navigationStrings.HOME)
                    Snackbar.dismiss();
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
                text: `${'Please Select the Location, Category & SubCategory again.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }
    }


    return (
        <WrapperContainer>
            <StatusBar backgroundColor={'#fff'} />
            <View style={styles.container}>
                <HeaderBack mainText='Edit Event' isLeftImage={Eventdata ? Eventdata.isLeftImage : false} />
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ paddingHorizontal: moderateScale(0.5) }}>
                        <Image source={imagePath.hevent} style={{ alignSelf: 'center', height: scale(110), width: scale(110) }} />
                        <Text style={styles.phoneHeading}>Edit Event</Text>
                        <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Basic Information</Text>

                        <View style={{ justifyContent: 'center', marginVertical: moderateScaleVertical(5), backgroundColor: 'white', borderRadius: scale(5),borderColor:'#D3D3D3',borderWidth:1, elevation: 3, height: moderateScale(50), }}>
                            <Dropdown
                                style={{ paddingHorizontal: moderateScale(13) }}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                iconStyle={{
                                    width: moderateScale(30),
                                    height: moderateScale(30),
                                }}
                                data={CategoryList.length > 0 ? CategoryList.map(category => ({ label: category.name, value: category._id })) : [{ label: 'No data available', value: null }]}
                                itemTextStyle={styles.itemTextStyle}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Please select event category'}
                                value={SelectedCategory}
                                // onFocus={() => setIsFocus(true)}
                                // onBlur={() => setIsFocus(false)}
                                onChange={(item) => {
                                    console.log(item, 'item ider aaya');
                                    // setCategory(item);
                                    getSubCategoryData(item.value);
                                    handleSelectCategory(item)
                                    setSelectedCategory(item)
                                    // setIsFocus(false);
                                }}

                            />
                        </View>

                        <View style={{ justifyContent: 'center', marginVertical: moderateScaleVertical(5), backgroundColor: 'white', borderRadius: scale(5),borderColor:'#D3D3D3',borderWidth:1, elevation: 3, height: moderateScale(50), }}>
                            <Dropdown
                                style={{ paddingHorizontal: moderateScale(13) }}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                iconStyle={{
                                    width: 30,
                                    height: 30,
                                }}
                                data={SubCategoryList.length > 0 ? SubCategoryList.map(category => ({ label: category.name, value: category._id })) : [{ label: 'No data available', value: null }]}
                                itemTextStyle={styles.itemTextStyle}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Please select event subcategory....'}
                                value={SelectedsubCategory}
                                // onFocus={() => setIsFocus(true)}
                                // onBlur={() => setIsFocus(false)}
                                onChange={(item) => {
                                    console.log(item, 'ye hai subCategory')
                                    handleSelectSubCategory(item)
                                    setSelectedsubCategory(item)
                                }}
                            />
                        </View>

                        <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Name of Event</Text>
                        <View style={{ marginVertical: moderateScaleVertical(5) }}>
                            <TextInputC placeholder={'Enter the name of event'}
                                value={EventName}
                                onChangeText={(text) => setEventName(text)}
                                keyBoardType='email-address'
                            />
                        </View>
                        {Eventdata.eventType === 'PAID' && <>
                            <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Amount for Event</Text>
                            <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                <TextInputC placeholder={'Enter the amount'}
                                    value={amount}
                                    onChangeText={(text) => setamount(text)}
                                    keyBoardType='numeric'
                                    isrightIcon={true}
                                    iconname={'paid'}
                                />
                            </View>
                        </>
                        }
                        <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Description of Event</Text>
                        <View style={{ marginVertical: moderateScaleVertical(5) }}>
                            <TextInputC placeholder={'Write a Description'}
                                value={Description}
                                onChangeText={(text) => setDescription(text)}
                                keyBoardType='default'
                                multiline={true}
                                numberOfLines={5}
                                style={{ height: moderateScaleVertical(120), textAlignVertical: 'top', }}
                            />
                        </View>
                        <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Min. and  Max. Number of people</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            <View style={{ marginVertical: moderateScaleVertical(5), width: '48%' }}>
                                <TextInputC
                                    placeholder={'Min No. of people '}
                                    value={MnPeople}
                                    onChangeText={(text) => setMnPeople(text)}
                                    keyBoardType={'numeric'}
                                />
                            </View>

                            <View style={{ marginVertical: moderateScaleVertical(5), width: '48%' }}>
                                <TextInputC
                                    placeholder={'Max No. of people'}
                                    value={MxPeople}
                                    onChangeText={(text) => setMxPeople(text)}
                                    keyBoardType={'numeric'}
                                />
                            </View>
                        </View>
                        <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Date of Event</Text>

                        <View style={{ marginVertical: moderateScaleVertical(5) }}>

                            <TextInputC placeholder={'Date of Event'}
                                imgsrc={imagePath.calendar} imgright={true}
                                onPressSecure={showDatePicker}
                                editable={false}
                                value={DOB}
                            />
                        </View>
                        {isDatePickerVisible && <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />}
                        <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Timings of Event</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ marginVertical: moderateScaleVertical(5), width: '48%' }}>
                                <TextInputC
                                    placeholder={'Start'}
                                    imgsrc={imagePath.down} imgright={true}
                                    onPressSecure={showStartTime}
                                    editable={false}
                                    value={startTime}
                                />
                                {isStartTime && <DateTimePickerModal
                                    isVisible={isStartTime}
                                    mode="time"
                                    onConfirm={handletime}
                                    onCancel={hidestartTimePicker}
                                />}
                            </View>
                            <View style={{ marginVertical: moderateScaleVertical(5), width: '48%' }}>
                                <TextInputC
                                    placeholder={'End'}
                                    imgsrc={imagePath.down} imgright={true}
                                    onPressSecure={showStartTime2}
                                    editable={false}
                                    value={EndTime}
                                />
                                {isEndTime && <DateTimePickerModal
                                    isVisible={isEndTime}
                                    mode="time"
                                    onConfirm={handletime2}
                                    onCancel={hidestartTimePicker2}
                                    date={new Date()}
                                />}
                            </View>
                        </View>
                        <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700', marginVertical: moderateScaleVertical(5) }]}>Address</Text>
                        <View>
                            <SearchPlaces placeholder='Change Event Location' onSearchPlaces={onSearchhandle} />
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(5) }}>
                            <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700', marginVertical: moderateScaleVertical(5) }]}>Participant Type</Text>
                            {/* <RadioForm
                                labelStyle={{ marginRight: moderateScale(30), color: '#828282' }}
                                formHorizontal={true}
                                labelHorizontal={true}
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
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {radioButtons.map((item, index) => {
                                    return (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => {
                                                // handleSelect(label)
                                            }}>
                                                <Image style={{ height: 24, width: 24, resizeMode: 'contain', tintColor: '#828282' }} source={item.value == selected ? imagePath.radio_select : imagePath.radio_unselect} />
                                            </TouchableOpacity>
                                            <Text style={{ color: '#4F4F4F', fontWeight: '500' }} >{item.value}</Text>
                                        </View>
                                    )
                                })
                                }
                            </View>
                        </View>

                        {/* <View style={{ marginVertical: moderateScaleVertical(5) }}>
                            <TextInputC
                                placeholder={'Search by locality, area or road'}
                                value={LocationAddress}
                                onChangeText={(text) => setLocationAddress(text)}
                                imgright={true}
                                imgsrc={imagePath.search}
                            />
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(5) }}>
                            <Image source={imagePath.map3} style={{ width: '100%' }} />
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(5) }}>
                            <TextInputC
                                placeholder={'Full address'}
                                value={FullAddress}
                                onChangeText={(text) => setFullAdress(text)}
                            />
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(5) }}>
                            <TextInputC
                                placeholder={'Apartment/House number *'}
                                value={ApartMent}
                                onChangeText={(text) => setApartMent(text)}
                                keyBoardType={'numeric'}
                            />
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(5) }}>
                            <TextInputC
                                placeholder={'State'}
                                value={State}
                                onChangeText={(text) => setState(text)}
                                keyBoardType={'ascii-capable'}
                            />
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(5) }}>
                            <TextInputC
                                placeholder={'Street'}
                                value={Street}
                                onChangeText={(text) => setStreet(text)}
                                keyBoardType={'ascii-capable'}
                            />
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(5) }}>
                            <TextInputC
                                placeholder={'City'}
                                value={City}
                                onChangeText={(text) => setCity(text)}
                                keyBoardType={'ascii-capable'}
                            />
                        </View>
                        <View style={{ marginVertical: moderateScaleVertical(5) }}>
                            <TextInputC
                                placeholder={'Zip code *'}
                                value={Zip}
                                onChangeText={(text) => setZip(text)}
                                keyBoardType={'numeric'}
                            />
                        </View> */}
                        <View style={{ marginTop: moderateScaleVertical(20), justifyContent: 'flex-end' }}>
                            <ButtonComp onPress={Eventdata.eventType === 'PAID' ? handlePaidSubmit : handleSubmit} text='Submit' style={{ backgroundColor: value ? '#005BD4' : '#828282' }} />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
            <View>
                <Modal

                    coverScreen={true}
                    isVisible={openModal}
                    backdropColor="#000"
                    hasBackdrop={true}
                    backdropOpacity={0.8}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={900}
                    animationOutTiming={800}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                    style={{ justifyContent: 'flex-end', margin: 0 }}
                >
                    <View style={styles.modalStyleImg}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.hometxt}>Update Images</Text>
                            </View>
                            <TouchableOpacity onPress={() => setopenModal(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: '#ffff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(15) }}>
                            {/* <TouchableOpacity onPress={() => captureImage('photo')} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                <Text style={styles.txt}>Upload</Text>
                                <Image source={imagePath.camera} tintColor={'#4F4F4F'} />
                            </TouchableOpacity>
                            <View style={{
                                marginVertical: moderateScaleVertical(5),
                                borderWidth: 0.2, borderBottomColor: '#BDBDBD'
                            }} /> */}
                            <TouchableOpacity onPress={() => chooseFile('photo')} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                <Text style={styles.txt}>Gallery</Text>
                                <Image source={imagePath.gal} tintColor={'#4F4F4F'} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {local ? (

                                    gallery[0] && gallery[0].map((item, index) => {
                                        // console.log(item.uri, 'img...')
                                        return (
                                            <View key={index} style={{ marginHorizontal: moderateScale(10) }}>
                                                <Image source={{ uri: item }} style={{ height: moderateScale(50), width: moderateScale(50), marginVertical: moderateScaleVertical(5) }} resizeMode='cover' />
                                            </View>
                                        )
                                    })

                                )
                                    : (

                                        Newgallery && Newgallery.map((item, index) => {
                                            // console.log(item, 'img...')
                                            return (
                                                <View key={index} style={{ marginHorizontal: moderateScale(10) }}>
                                                    <Image source={{ uri: item.uri }} style={{ height: moderateScale(50), width: moderateScale(50), marginVertical: moderateScaleVertical(5) }} resizeMode='cover' />
                                                </View>
                                            )
                                        })

                                    )
                                }
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10), paddingHorizontal: moderateScale(10) }}>
                            {/* <Text style={[styles.txt, { fontSize: scale(16) }]}>{'>>  Skip'}</Text> */}
                            <ButtonComp isLoading={Loading} onPress={Eventdata.eventType === 'PAID' ? handlepaidCreate : handleCreateEvent} text='Continue' style={{ backgroundColor: '#005BD4', width: '100%' }} />
                        </View>
                    </View>
                </Modal>
            </View>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(12),
        backgroundColor: '#FFFFFF'
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
        marginVertical: moderateScaleVertical(2)

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
    },
    placeholderStyle: {
        color: 'gray',
        fontFamily: 'Roboto',
        fontSize: scale(15),
        fontWeight: '500',
    },
    selectedTextStyle: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: textScale(16),
        fontWeight: '500'

    },
    itemTextStyle: {
        color: '#828282',
        fontFamily: 'Roboto',
        fontSize: scale(16),
        fontWeight: '700'
    },
    modalStyleImg: {
        backgroundColor: '#F2F2F2',
        minHeight: moderateScale(height / 4),
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        // borderRadius: moderateScale(30),
        padding: moderateScale(15),
    },
    hometxt: {
        color: '#333',
        fontSize: scale(22),
        fontFamily: 'Roboto',
        fontWeight: '800'
    },
    txt: {
        color: '#4F4F4F',
        fontFamily: 'Poppins',
        fontSize: scale(16),
        fontWeight: '700'
    }

});

//make this component available to the app
export default EditEvent;

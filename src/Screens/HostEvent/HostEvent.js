//import liraries
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Image, Alert, StatusBar, TouchableOpacity, Platform, PermissionsAndroid, ImageBackground, } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale, height, textScale } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import TextInputC from '../../Components/TextInputC';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import HeaderBack from '../../Components/HeaderBack';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-native-modal'
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import { AUTH_CONFIG } from '../../constants/Path';
import axios from 'axios';
import { getData } from '../../utils/helperFunctions';
import Snackbar from 'react-native-snackbar';
import navigationStrings from '../../Navigation/navigationStrings';
import Iconpaid from 'react-native-vector-icons/MaterialIcons'
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import RadioForm from 'react-native-simple-radio-button'
import SearchPlaces from '../../Components/SearchPlaces';
import { Dropdown } from 'react-native-element-dropdown';
import commonStyles from '../../styles/commonStyles';





// create a component
const HostEvent = ({ navigation, route }) => {
    const User = useSelector((state) => state.persistedReducer.authSlice.userData);
    console.log(User, 'user')

    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const routedata = route?.params;
    // console.log(routedata, 'routedata')

    const [openoptionModal, setoptionopenModal] = useState(isFocused);


    const [selected, setselected] = useState('');
    const [userType, setuserType] = useState(' ');
    const [CategoryList, setCategoryList] = useState([]);
    const [SubCategoryList, setSubCategoryList] = useState([]);
    const [EventName, setEventName] = useState('');
    const [Description, setDescription] = useState('');
    const [MxPeople, setMxPeople] = useState('');
    const [MnPeople, setMnPeople] = useState('');
    const [DOB, setDOB] = useState('');
    const [startTime, setstartTime] = useState('');
    const [EndTime, setEndTime] = useState('');
    const [latitude, setlatitude] = useState(null)
    const [longitude, setlongitude] = useState(null)
    const [ImageModal, setImageModal] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isStartTime, setisStartTime] = useState(false);
    const [isEndTime, setisEndTime] = useState(false);
    const [Uplaod, setUpload] = useState([]);
    const [gallery, setgallery] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [local, setlocal] = useState(false);
    const [amount, setamount] = useState(null);
    const [visiblePaid, setvisiblePaid] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [SelectedCategory, setSelectedCategory] = useState('')
    const [SelectedsubCategory, setSelectedsubCategory] = useState('')
    const [address, setAddress] = useState(null);


    const [eventCategoryError, seteventCategoryError] = useState('');
    const [eventSubCategoryError, seteventSubcategoryError] = useState('');
    const [eventnameErr, seteventnameErr] = useState('');
    const [eventamountErr, seteventamountErr] = useState('');
    const [eventdescriptionErr, seteventdescriptionErr] = useState('');
    const [eventminpeopleErr, seteventminpeopleErr] = useState('');
    const [eventmaxpeopleErr, seteventmaxpeopleErr] = useState('');
    const [eventdateErr, seteventdateErr] = useState('');
    const [eventstarttimeErr, seteventstarttimeErr] = useState('');
    const [eventendtimeErr, seteventendtimeErr] = useState('');
    const [eventaddressErr, seteventaddressErr] = useState('');

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

    const handleSelect = (label) => {
        if (label === 'Other') {
            setselected('')

        } else {
            setselected(label)
        }

    }

    useEffect(() => {
        setoptionopenModal(isFocused)
        console.log('UseEffect is running')
        if (!!routedata) {
            setoptionopenModal(false)
            setuserType(routedata.EventType)
            setvisiblePaid(routedata.isPaid)
        } else {
            // console.log('ye chal gya yha p')
            setoptionopenModal(isFocused)
            // console.log(openoptionModal, 'option')
        }
        // setoptionopenModal(isFocused)

    }, [isFocused])
    //  console.log(userType)

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
                console.log(JSON.stringify(res.data), 'cataaya in tabroute m')
                setCategoryList(res?.data?.categories);
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
                console.log(res, 'subCategory aaya idehr')
                setSubCategoryList(res?.data?.subCategories)
                // setCategoryList(res.data.categories);
                // setCategoryList(res.data)
            })
            .catch((err) => console.log(err, 'subcat m err'))
    }



    const handleSubmit = () => {
        console.log('hello free event')
        if (SelectedCategory == '') {
            seteventCategoryError('Please select event category.')
            Snackbar.show({
                text: `${'Please select event category.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }
        else if (SelectedsubCategory == '') {
            seteventCategoryError('')
            seteventSubcategoryError('Please select event subcategory.')
            Snackbar.show({
                text: `${'Please select event subcategory.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }
        else if (EventName == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('Please enter event name.')
            Snackbar.show({
                text: `${'Please enter event name.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (Description == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('Please enter event description.')
            Snackbar.show({
                text: `${'Please enter event description.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (MnPeople == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventminpeopleErr('Please enter min no. of people.')
            Snackbar.show({
                text: `${'Please enter min no. of people.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (MxPeople == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventminpeopleErr('')
            seteventmaxpeopleErr('Please enter max no. of people.')
            Snackbar.show({
                text: `${'Please enter max no. of people.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (DOB == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventminpeopleErr('')
            seteventmaxpeopleErr('')
            seteventdateErr('Please select event date.')
            Snackbar.show({
                text: `${'Please select event date.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (startTime == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventminpeopleErr('')
            seteventmaxpeopleErr('')
            seteventdateErr('')
            seteventstarttimeErr('Please enter event start time.')
            Snackbar.show({
                text: `${'Please enter event start time.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (EndTime == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventminpeopleErr('')
            seteventmaxpeopleErr('')
            seteventdateErr('')
            seteventstarttimeErr('')
            seteventendtimeErr('Please enter event end time.')
            Snackbar.show({
                text: `${'Please enter event end time.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (address == null) {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventminpeopleErr('')
            seteventmaxpeopleErr('')
            seteventdateErr('')
            seteventstarttimeErr('')
            seteventendtimeErr('')
            seteventaddressErr('Please select Address.')
            Snackbar.show({
                text: `${'Please select Address.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (EventName && Description && MxPeople && MnPeople && DOB && startTime && EndTime
            && latitude && longitude && userType && selected
        ) {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventminpeopleErr('')
            seteventmaxpeopleErr('')
            seteventdateErr('')
            seteventstarttimeErr('')
            seteventendtimeErr('')
            seteventaddressErr('')
            setImageModal(true)
            if (setImageModal) {
                setoptionopenModal(false)
            }
        } else {
            Snackbar.show({
                text: `${'Something went wrong!'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }
    }

    const handlePaidSubmit = () => {
        console.log('hello paid event')
        if (SelectedCategory == '') {
            seteventCategoryError('Please select event category.')
            Snackbar.show({
                text: `${'Please select event category.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }
        else if (SelectedsubCategory == '') {
            seteventCategoryError('')
            seteventSubcategoryError('Please select event subcategory.')
            Snackbar.show({
                text: `${'Please select event subcategory.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }
        else if (EventName == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('Please enter event name.')
            Snackbar.show({
                text: `${'Please enter event name.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (amount == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventamountErr('Please enter event amount.')
            Snackbar.show({
                text: `${'Please enter event amount.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (Description == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventamountErr('')
            seteventdescriptionErr('Please enter event description.')
            Snackbar.show({
                text: `${'Please enter event description.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (MnPeople == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventamountErr('')
            seteventminpeopleErr('Please enter min no. of people.')
            Snackbar.show({
                text: `${'Please enter min no. of people.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (MxPeople == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventamountErr('')
            seteventminpeopleErr('')
            seteventmaxpeopleErr('Please enter max no. of people.')
            Snackbar.show({
                text: `${'Please enter max no. of people.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (DOB == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventamountErr('')
            seteventminpeopleErr('')
            seteventmaxpeopleErr('')
            seteventdateErr('Please select event date.')
            Snackbar.show({
                text: `${'Please select event date.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (startTime == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventamountErr('')
            seteventminpeopleErr('')
            seteventmaxpeopleErr('')
            seteventdateErr('')
            seteventstarttimeErr('Please enter event start time.')
            Snackbar.show({
                text: `${'Please enter event start time.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (EndTime == '') {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventamountErr('')
            seteventminpeopleErr('')
            seteventmaxpeopleErr('')
            seteventdateErr('')
            seteventstarttimeErr('')
            seteventendtimeErr('Please enter event end time.')
            Snackbar.show({
                text: `${'Please enter event end time.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (address == null) {
            seteventCategoryError('')
            seteventSubcategoryError('')
            seteventnameErr('')
            seteventdescriptionErr('')
            seteventminpeopleErr('')
            seteventmaxpeopleErr('')
            seteventdateErr('')
            seteventamountErr('')
            seteventstarttimeErr('')
            seteventendtimeErr('')
            seteventaddressErr('Please select Address.')
            Snackbar.show({
                text: `${'Please select Address.'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        } else if (EventName && Description && MxPeople && MnPeople && DOB && startTime && EndTime
            && latitude && longitude && userType && selected && amount
        ) {
            setImageModal(true)
            if (setImageModal) {
                setoptionopenModal(false)
            }
        } else {
            Snackbar.show({
                text: `${'Something went wrong!'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });
        }
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
    // const handletime = (date) => {
    //     const dt = new Date(date);
    //     console.log('dob',DOB)
    //     let tzTime = dt.toLocaleTimeString()
    //     let newTime = tzTime.split(':')
    //     let Dformat = newTime[2]
    //     let Finaltime = newTime[0] + ':' + newTime[1] + ' ' + Dformat.substring(3, 5).toUpperCase();
    //     console.log(Finaltime, 'ye start time hai')

    //     setstartTime(Finaltime);
    //     setisStartTime(false);
    // }

    const handletime = (date) => {
        const selectedDate = new Date(date);
        const currentDate = new Date();
        const selectedTime = selectedDate.getTime();
        const currentTime = currentDate.getTime();

        // Check if the selected date and time is in the past
        if (selectedTime < currentTime) {
            Alert.alert('Start time is in the past. Please select a future time.')
            return;
        }
    
        let tzTime = selectedDate.toLocaleTimeString();
        let newTime = tzTime.split(':');
        let Dformat = newTime[2];
        let Finaltime = newTime[0] + ':' + newTime[1] + ' ' + Dformat.substring(3, 5).toUpperCase();
        
        console.log(Finaltime, 'ye start time hai');
    
        setstartTime(Finaltime);
        setisStartTime(false);
    };

    const handletime2 = (date) => {
        const selectedDate = new Date(date);
    
        // Parse the startTime (e.g., "11:50 AM")
        const [time, modifier] = startTime.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        minutes = parseInt(minutes);
    
        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        } else if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
    
        // Set the start time on the selected date
        const startDate = new Date(selectedDate);
        startDate.setHours(hours, minutes, 0, 0);
    
        console.log('startTime', startTime);
        console.log('selectedDate', selectedDate);
        console.log('startDate', startDate);
    
        const selectedTime = selectedDate.getTime();
        const startTimeMillis = startDate.getTime();
    
        // Check if the selected date and time is in the past
        if (selectedTime <= startTimeMillis) {
            Alert.alert('Start time should not be less than or equal to end time');
            return;
        }
    
        let tzTime = selectedDate.toLocaleTimeString();
        let newTime = tzTime.split(':');
        let Dformat = newTime[2];
        let Finaltime = newTime[0] + ':' + newTime[1] + ' ' + Dformat.substring(3, 5).toUpperCase();
    
        setEndTime(Finaltime);
        console.log(Finaltime, 'ye Endtime time hai');
        setisEndTime(false);
    };
    

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
            setgallery(response?.assets)
            setlocal(true)
        });
    };

    // console.log(openoptionModal, '.......', isFocused);
    const handlePaidCreateEvent = async () => {
        console.log('paid Event created')
        setLoading(true);
        console.log(EventName, 'EventName')
        console.log(Description, 'description')
        console.log(MxPeople, 'maxpple')
        console.log(MnPeople, 'minpple')
        console.log(DOB, 'EventDate')
        console.log(startTime, 'starttime')
        console.log(EndTime, 'Endtime')
        // console.log(Uplaod, 'yecamera');
        console.log(gallery, 'yegallehg');
        console.log(latitude, 'latitude');
        console.log(longitude, 'longitude');
        console.log(selected, 'participants');
        console.log(userType, 'USERType')

        console.log(SelectedCategory, 'Category');
        console.log(SelectedsubCategory, 'SubCategory');
        console.log(address, 'address in string')
        console.log(amount, 'Eventamount')


        const formData = new FormData();
        formData.append('name', EventName);
        formData.append('description', Description);
        formData.append('maxPeople', MxPeople);
        formData.append('minPeople', MnPeople);
        formData.append('dateOfEvent', DOB);
        formData.append('timeStart', startTime);
        formData.append('timeEnd', EndTime);

        gallery?.forEach((image, index) => {
            // console.log(image.uri, 'image')
            formData.append(`images`, {
                uri: image.uri,
                type: image.type,
                name: image.fileName || `image_${index}.jpg`,
            });
        });

        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('participantType', selected);
        formData.append('eventType', userType);
        formData.append('category', SelectedCategory.value);
        formData.append('subCategory', SelectedsubCategory.value);
        formData.append('address', address);
        formData.append('amount', amount);

        console.log(formData, 'formDatacollection')

        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': 'multipart/form-data',
        };
        axios.post(AUTH_CONFIG.EVENT_URL + '/add-new-event', formData, { headers })
            .then((res) => {
                // console.log(res, 'resEvents');
                const events = res.data;
                console.log(events, 'with events')
                // const data = res.data.user;
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
                setSelectedCategory('');
                setSelectedsubCategory('');
                setgallery([]);
                // setTimeout(() => {
                setImageModal(false);
                navigation.navigate(navigationStrings.HOME)
                Snackbar.dismiss();
                // }, 2000);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                Snackbar.show({
                    text: `${error.response.data.dateOfEvent}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    textColor: "#fff",
                });
            });
    }

    const handleCreateEvent = async () => {
        console.log('Free Event')

        setLoading(true);
        console.log(EventName, 'EventName')
        console.log(Description, 'description')
        console.log(MxPeople, 'maxpple')
        console.log(MnPeople, 'minpple')
        console.log(DOB, 'EventDate')
        console.log(startTime, 'starttime')
        console.log(EndTime, 'Endtime')
        // console.log(Uplaod, 'yecamera');
        console.log(gallery, 'yegallehg');
        console.log(latitude, 'latitude');
        console.log(longitude, 'longitude');
        console.log(selected, 'participants');
        console.log(userType, 'USERType')
        console.log(SelectedCategory, 'Category');
        console.log(SelectedsubCategory, 'SubCategory');
        console.log(address, 'address in string')
        const formData = new FormData();
        formData.append('name', EventName);
        formData.append('description', Description);
        formData.append('maxPeople', MxPeople);
        formData.append('minPeople', MnPeople);
        formData.append('dateOfEvent', DOB);
        formData.append('timeStart', startTime);
        formData.append('timeEnd', EndTime);
        gallery?.forEach((image, index) => {
            // console.log(image.uri, 'image')
            formData.append(`images`, {
                uri: image.uri,
                type: image.type,
                name: image.fileName || `image_${index}.jpg`,
            });
        });
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('participantType', selected);
        formData.append('eventType', userType);
        formData.append('category', SelectedCategory.value);
        formData.append('subCategory', SelectedsubCategory.value);
        formData.append('address', address);
        console.log(formData, 'formDatacollection')
        let usertoken = await getData('UserToken');
        console.log(usertoken, 'token')
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': 'multipart/form-data',
        };
        console.log(AUTH_CONFIG.EVENT_URL + '/add-new-event', 'endurl');
        axios.post(AUTH_CONFIG.EVENT_URL + '/add-new-event', formData, { headers })
            .then((res) => {
                console.log(res, 'resEvents');
                const events = res.data;
                console.log(events, 'with events')
                // const data = res.data.user;
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
                setSelectedCategory('');
                setSelectedsubCategory('');
                setgallery([]);
                setImageModal(false);
                navigation.navigate(navigationStrings.HOME)
                Snackbar.dismiss();
            })
            .catch((error) => {
                setLoading(false);
                console.log('handleCreateEventError', error)
                Snackbar.show({
                    text: `${error.response.data.dateOfEvent}`,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                    textColor: "#fff",
                });
            });

    }


    const reverseGeocode = async (latitude, longitude) => {
        const apiKey = 'AIzaSyDoIp9EAqQ10AGtqcgNm6TWndqvUgroHJk';
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            // console.log(data, 'addrress')

            if (data.results && data.results.length > 0) {
                const formattedAddress = data.results[0].formatted_address;
                setAddress(formattedAddress);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const onSearchhandle = (data, details) => {
        console.log('NewLocationyhaHostEvent m',
            data,
            "DETAILS--", details
        )
        const selectedLocation = details.geometry.location;
        const { lat, lng } = selectedLocation;
        console.log(lat, '...', lng)
        const latitude = lat;
        const longitude = lng;
        setlatitude(latitude);
        setlongitude(longitude);
        reverseGeocode(latitude, longitude);
    }

    // const ChooseSubCategory = (item) => {
    //     console.log('ye chala')
    //     console.log(item, 'item ider hai')
    //     if (item.label === 'FOOD & BEVERAGE') {
    //         console.log('ye chala if k andar')
    //         setSubCategory([
    //             { label: 'Cucina', value: '3' },
    //             { label: 'LIFE', value: '4' },
    //         ]);
    //     }
    //     if (item.label === 'NIGHT LIFE') {
    //         setSubCategory(Art)
    //     }

    // }

    const handleSelectCategory = (item) => {
        console.log(item, 'category')
        // setCategory(item);
        setSelectedCategory(item.label)
    }


    const handleSelectSubCategory = (item) => {
        // setSubCategory(item);
        setSelectedsubCategory(item.label);
    }
    console.log('CategoryList', CategoryList)


    return (
        <>
            <WrapperContainer>
                <StatusBar backgproundColor={'#fff'} />
                <View style={styles.container}>
                    <HeaderBack mainText='Host an Event' isLeftImage={routedata ? routedata.isLeftImage : false} />
                    <KeyboardAwareScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={{ paddingHorizontal: moderateScale(0.5) }}>
                            <Image source={imagePath.hevent} style={{ alignSelf: 'center', height: scale(110), width: scale(110) }} />
                            <Text style={styles.phoneHeading}>Host an Event</Text>
                            <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Basic Information</Text>
                            <View style={{ justifyContent: 'center', marginVertical: moderateScaleVertical(5), backgroundColor: 'white', borderRadius: scale(5), borderColor: '#D3D3D3', borderWidth: 1, height: moderateScale(50), }}>
                                <Dropdown
                                    mode='default'
                                    containerStyle={{ borderWidth: 3, }}
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
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={(item) => {
                                        console.log(item, 'item ider aaya');
                                        getSubCategoryData(item.value);
                                        handleSelectCategory(item)
                                        setSelectedCategory(item)
                                    }}
                                />

                            </View>
                            {eventCategoryError && <Text style={{ color: '#FF0000', fontFamily: 'Roboto', fontSize: textScale(14), fontWeight: '500' }}>{eventCategoryError}</Text>}
                            {SubCategoryList.length > 0 &&
                                <View style={{ justifyContent: 'center', marginVertical: moderateScaleVertical(5), backgroundColor: 'white', borderRadius: scale(5), backgroundColor: 'white', borderRadius: scale(5), borderColor: '#D3D3D3', borderWidth: 1, height: moderateScale(50), }}>
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
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={(item) => {
                                            console.log(item, 'ye hai subCategory')
                                            handleSelectSubCategory(item)
                                            setSelectedsubCategory(item)
                                        }}
                                    />

                                </View>}
                            {eventSubCategoryError && <Text style={{ color: '#FF0000', fontFamily: 'Roboto', fontSize: textScale(14), fontWeight: '500' }}>{eventSubCategoryError}</Text>}
                            <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Name of Event</Text>
                            <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                <TextInputC
                                    editable={true}
                                    placeholder={'Enter the name of event'}
                                    value={EventName}
                                    errorTxt={eventnameErr}
                                    onChangeText={(text) => setEventName(text)}
                                    keyBoardType='email-address'
                                />
                            </View>
                            {visiblePaid && <>
                                <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Amount for Event</Text>
                                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                    <TextInputC
                                        editable={true}
                                        errorTxt={eventamountErr}
                                        placeholder={'Enter the amount'}
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
                                <TextInputC
                                    editable={true}
                                    placeholder={'Write a description'}
                                    errorTxt={eventdescriptionErr}
                                    value={Description}
                                    onChangeText={(text) => setDescription(text)}
                                    keyBoardType='email-address'
                                    multiline={true}
                                    numberOfLines={5}
                                    style={{ height: moderateScaleVertical(120), textAlignVertical: 'top', }}
                                />
                            </View>
                            <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Min. and  Max. Number of people</Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>


                                <View style={{ marginVertical: moderateScaleVertical(5), width: '48%' }}>
                                    <TextInputC
                                        placeholder={'Min no. of people '}
                                        //  errorTxt={eventminpeopleErr}
                                        value={MnPeople}
                                        editable={true}
                                        onChangeText={(text) => setMnPeople(text)}
                                        keyBoardType={'numeric'}
                                    />

                                </View>
                                <View style={{ marginVertical: moderateScaleVertical(5), width: '48%' }}>
                                    <TextInputC
                                        editable={true}
                                        //   errorTxt={eventmaxpeopleErr}
                                        placeholder={'Max no. of people'}
                                        value={MxPeople}
                                        onChangeText={(text) => setMxPeople(text)}
                                        keyBoardType={'numeric'}
                                    />

                                </View>

                            </View>
                            {eventminpeopleErr && <Text style={{ marginLeft: 10, color: '#FF0000', flex: 1, fontFamily: 'Roboto', fontSize: textScale(13) }}>{eventminpeopleErr}</Text>}
                            {eventmaxpeopleErr && <Text style={{ marginLeft: 10, color: '#FF0000', flex: 1, fontFamily: 'Roboto', fontSize: textScale(13) }}>{eventmaxpeopleErr}</Text>}
                            <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Date of Event</Text>

                            <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                <TextInputC
                                    placeholder={'Date of event'}
                                    errorTxt={eventdateErr}
                                    imgsrc={imagePath.calendar}
                                    imgright={true}
                                    onPressSecure={showDatePicker}
                                    editable={false}
                                    value={DOB}
                                    onPress={showDatePicker}
                                />
                            </View>
                            {isDatePickerVisible && <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                minimumDate={new Date()}
                            />}
                            <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700' }]}>Timings of Event</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ marginVertical: moderateScaleVertical(5), width: '48%' }}>
                                    <TextInputC
                                        placeholder={'Start'}
                                        //  errorTxt={eventstarttimeErr}
                                        imgsrc={imagePath.down} imgright={true}
                                        onPressSecure={showStartTime}
                                        onPress={showStartTime}
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
                                        //   errorTxt={eventendtimeErr}
                                        imgsrc={imagePath.down} imgright={true}
                                        onPressSecure={showStartTime2}
                                        onPress={showStartTime2}
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
                            {eventstarttimeErr && <Text style={{ marginLeft: 10, color: '#FF0000', flex: 1, fontFamily: 'Roboto', fontSize: textScale(13) }}>{eventstarttimeErr}</Text>}
                            {eventendtimeErr && <Text style={{ marginLeft: 10, color: '#FF0000', flex: 1, fontFamily: 'Roboto', fontSize: textScale(13) }}>{eventendtimeErr}</Text>}
                            <Text
                                onPress={() => {
                                    console.log("=============");
                                }}
                                style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700', marginVertical: moderateScaleVertical(5) }]}>Address</Text>
                            <View>
                                <SearchPlaces
                                    placeholder='Select Location'
                                    onSearchPlaces={onSearchhandle} />
                            </View>
                            {eventaddressErr && <Text style={{ marginLeft: moderateScale(10), color: '#FF0000', fontFamily: 'Roboto', fontSize: textScale(14) }}>{eventaddressErr}</Text>}

                            <View style={{ marginVertical: moderateScaleVertical(5) }}>
                                <Text style={[styles.phoneHeading2, { color: '#4F4F4F', fontWeight: '700', marginVertical: moderateScaleVertical(5) }]}>Participant Type</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {radioButtons.map((item, index) => {
                                        return (
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => handleSelect(item.label)}>
                                                    <Image style={{ height: 24, width: 24, resizeMode: 'contain', tintColor: '#828282' }} source={item.value == selected ? imagePath.radio_select : imagePath.radio_unselect} />
                                                </TouchableOpacity>
                                                <Text style={{ color: '#4F4F4F', fontWeight: '500' }} >{item.value}</Text>
                                            </View>
                                        )
                                    })
                                    }
                                </View>
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
                            </View>
                            <View style={{ marginTop: moderateScaleVertical(20), justifyContent: 'flex-end' }}>
                                <ButtonComp onPress={userType === 'FREE' ? handleSubmit : handlePaidSubmit} text='Submit' style={{ backgroundColor: EventName ? '#005BD4' : '#828282' }} />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <View>
                    <Modal
                        coverScreen={true}
                        isVisible={ImageModal}
                        backdropColor="#000"
                        hasBackdrop={true}
                        backdropOpacity={0.9}
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
                                    <Text style={styles.hometxt}>Add Images</Text>
                                </View>
                                <TouchableOpacity onPress={() => setImageModal(false)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                            </View>
                            <View style={{ backgroundColor: '#ffff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(15) }}>
                                <TouchableOpacity onPress={() => chooseFile('photo')} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                                    <Text style={styles.txt}>Gallery</Text>
                                    <Image source={imagePath.gal} tintColor={'#4F4F4F'} />
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {local &&
                                        (
                                            gallery && gallery.map((item, index) => {
                                                return (
                                                    <View key={index} style={{ marginHorizontal: moderateScale(10) }}>
                                                        <Image source={{ uri: item.uri }} style={{ height: moderateScale(50), width: moderateScale(50), }} resizeMode='cover' />
                                                    </View>
                                                )
                                            })
                                        )
                                    }
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10), paddingHorizontal: moderateScale(10) }}>
                                <TouchableOpacity onPress={amount === null ? handleCreateEvent : handlePaidCreateEvent} style={{ width: '45%' }}>
                                    <Text style={[styles.txt, { fontSize: scale(16), }]}>{'>>  Skip'}</Text>
                                </TouchableOpacity>
                                <View style={{ width: '45%' }}>
                                    <ButtonComp isLoading={Loading} onPress={amount === null ? handleCreateEvent : handlePaidCreateEvent} text='Continue' style={{ backgroundColor: '#005BD4', }} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>

            </WrapperContainer>
            <View>
                <Modal
                    coverScreen={true}
                    isVisible={openoptionModal}
                    backdropColor="rgba(255,255, 255, 0.8)"
                    backdropOpacity={User.kyc.isVerified ? 0.8 : 1}
                    hasBackdrop={true}
                    // onBackdropPress={() => setoptionopenModal(false)}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={900}
                    animationOutTiming={800}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                    style={{ justifyContent: 'flex-end', margin: 0 }}
                >
                    <View style={styles.modalStyle}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.hometxt}>Choose Event Type</Text>
                            </View>
                            <TouchableOpacity onPress={() => User.kyc.isVerified ? navigation.navigate(navigationStrings.HOME) : navigation.navigate(navigationStrings.HOME)}><Image source={imagePath.Close} tintColor={'#000'} /></TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: '#ffff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(10) }}>
                            <TouchableOpacity disabled={User.kyc.isVerified ? false : true} onPress={() => {
                                setoptionopenModal(false)
                                User.packageValidTill !== null ? (setuserType('PAID'), setvisiblePaid(true)) :
                                    navigation.navigate(navigationStrings.ALLPLANS)
                            }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <Text style={styles.txt}>Paid Event</Text>
                                <Iconpaid name='paid' size={30} color={'#005BD4'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: '#ffff', borderRadius: moderateScale(10), padding: moderateScale(10), marginVertical: moderateScaleVertical(5) }}>
                            <TouchableOpacity disabled={User.kyc.isVerified ? false : true} onPress={() => {
                                setuserType('FREE')
                                setoptionopenModal(false)
                            }} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <Text style={styles.txt}>Free Event</Text>
                                <Iconpaid name='try' size={30} color={'#005BD4'} />
                            </TouchableOpacity>
                        </View>
                        {
                            User.kyc.isVerified ? <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: moderateScaleVertical(10) }}>
                                <Image source={imagePath.kycN} resizeMode='contain' style={{ height: moderateScaleVertical(30), width: moderateScale(30), }} />
                                <Text style={[styles.phoneHeading, { fontSize: moderateScale(15), color: 'green', marginLeft: moderateScale(10), fontFamily: 'Roboto' }]}>KYC VERIFIED</Text>
                            </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => {
                                    setoptionopenModal(false)
                                    navigation.navigate(navigationStrings.REKYC)
                                }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: moderateScaleVertical(10) }}>
                                    <Image source={imagePath.kycN} resizeMode='contain' style={{ height: moderateScaleVertical(30), width: moderateScale(30), }} />
                                    <Text style={[styles.phoneHeading, { fontSize: moderateScale(15), color: 'red', marginLeft: moderateScale(10), fontFamily: 'Roboto' }]}>KYC REQUIRED</Text>
                                </TouchableOpacity>
                        }

                    </View>
                </Modal>
            </View>
        </>
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
        color: '#828282',
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
    modalStyle: {
        backgroundColor: '#F2F2F2',
        minHeight: moderateScale(height / 4),
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        padding: moderateScale(15)
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
export default HostEvent;

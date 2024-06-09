//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale, height } from '../../styles/responsiveSize';
import ButtonComp from '../../Components/ButtonComp';
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import Modal from 'react-native-modal'
import Snackbar from 'react-native-snackbar';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';
import { AUTH_CONFIG } from '../../constants/Path';
import navigationStrings from '../../Navigation/navigationStrings';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserData } from '../../redux/Slices/UserSlice';


// create a component
const Interests = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.persistedReducer?.authSlice?.userData);
    const [ProfileShow, setProfileShow] = useState(false);
    const [openModal, setopenModal] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [CategoryList, setCategoryList] = useState([]);
    const [length, setlength] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedCategory, setselectedCategory] = useState([]);

    console.log("user====", user);

    useEffect(() => {
        getCategoryData();
        setopenModal(true);
    }, [])

    const getCategoryData = async () => {
        let usertoken = await getData('UserToken');
        // console.log(usertoken, 'api m');
        const headers = {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': "application/json",
        };
        axios.get('https://plansaround-backend.vercel.app/api/mobile/category/category-with-subcategory', { headers })
            .then((res) => {
                // console.log(res, 'cataaya')
                const modifiedData = res.data.categories.map(category => ({
                    ...category,
                    subCategories: category.subCategories.map(subcategory => ({
                        ...subcategory,
                        isSelected: user?.interests?.length > 0 ? user?.interests?.includes(subcategory?._id) : false
                    }))
                }));
                console.log(modifiedData, 'modified data')
                setCategoryList(modifiedData)
                setselectedCategory(user?.interests || [])

            })
            .catch((err) => console.log(err, 'cat m err'))
    }


    const handleSelect = (item) => {
        console.log(item, 'selection m')
        CategoryList.map((Cat, index) => {
            // console.log(Cat, 'function m')
            Cat.subCategories.map((subCat, index) => {
                // console.log(subCat, 'sub m')
                if (subCat._id === item._id) {
                    subCat.isSelected = !subCat.isSelected
                    // setIsSelected(!isSelected)
                }
            })
        })

        if (selectedItems.includes(item._id)) {
            const index = selectedItems.indexOf(item._id);
            setSelectedItems(selectedItems.splice(index, 1));
        } else {
            setSelectedItems([...selectedItems, item._id]);
        }

        if (selectedCategory.includes(item.category_id)) {
            const index = selectedCategory.indexOf(item.category_id);
            setselectedCategory(selectedCategory.splice(index, 1));
        } else {
            setselectedCategory([...selectedCategory, item.category_id]);
        }

        // setSelectedItems([...selectedItems, item._id]);
        // setselectedCategory([...selectedCategory, item.category_id]);
    }
    // console.log(selectedItems, 'items total')
    // console.log(selectedCategory, 'items category')

    const handleSumbit = async () => {


        if (selectedItems.length > 0) {
            // console.log(selectedCategory, 'ye final category');
            // console.log(selectedItems, 'ye final items');

            const FinalCategory = [...new Set(selectedCategory)];

            console.log('selectedInterests====', FinalCategory);
            console.log('selectedItems====', selectedItems);
            setLoading(true);
            let usertoken = await getData('UserToken');
            console.log(usertoken, 'token')
            const headers = {
                'Authorization': `Bearer ${usertoken}`,
                'Content-Type': "application/json",
                // 'Content-Type': 'multipart/form-data',
            };

            axios.post(AUTH_CONFIG.BASE_URL + '/interests', { "categories": FinalCategory, "subCategories": selectedItems }, { headers })
                .then((res) => {
                    console.log(res, 'Interest');
                    const data = res.data.user;
                    dispatch(saveUserData(data));
                    setLoading(false);
                    Snackbar.show({
                        text: `${res.data.message}`,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: '#005BD4',
                        textColor: "#fff",
                    });
                    // setTimeout(() => {
                    //     Snackbar.dismiss();
                    if (route?.params?.isFrom == 'Main') {
                        navigation.navigate(navigationStrings.SETTINGS)
                    } else {
                        navigation.navigate(navigationStrings.REKYC)
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
                text: `${'Please Select Interests'}`,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
                textColor: "#fff",
            });

        }
    }
    return (
        <>
            <WrapperContainer>
                <View style={styles.container}>
                    <ScrollView nestedScrollEnabled style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={[styles.helpIcon, { justifyContent: 'space-between', }]}>
                            <TouchableOpacity
                                style={{ marginRight: moderateScale(10) }}
                                onPress={() => navigation.goBack()}>
                                <Image style={{ tintColor: '#000' }} source={imagePath.arrowleft} />
                            </TouchableOpacity>
                            <Image source={imagePath.help_outline} />
                        </View>
                        <View style={{ flex: 1, marginBottom: moderateScaleVertical(200) }}>
                            <Image source={imagePath.interest} style={{ alignSelf: 'center', height: scale(110), width: scale(110) }} />
                            <Text style={styles.phoneHeading}>What are your Interests?</Text>
                            <Text style={styles.phoneHeading2}>Pick up to 10 interests so that we can develop and search events based on your preferences.</Text>
                            {/* <Text style={[styles.txtheading, { marginLeft: 0, marginVertical: moderateScaleVertical(5) }]}>Self care</Text> */}
                            <View>
                                {
                                    CategoryList && CategoryList.map((item, index) => {
                                        // console.log(item, 'category')
                                        return (
                                            <View key={index}>
                                                <Text style={[styles.txtheading, { marginLeft: 0, marginVertical: moderateScaleVertical(5) }]}>{item.name ? item.name : 'NA'}</Text>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    {item.subCategories && item.subCategories.map((sub, index) => {
                                                        // console.log(sub, 'subcategory');
                                                        return (
                                                            <View key={index} style={{ flexDirection: 'row', margin: scale(5) }}>
                                                                <TouchableOpacity style={[styles.Interestscontainer, {
                                                                    backgroundColor: sub.isSelected ? '#333' : '#fff',
                                                                }]} onPress={() => handleSelect(sub)}>
                                                                    <Image source={{ uri: sub.icon }} tintColor={item.isSelected ? '#fff' : null} style={{ height: moderateScale(20), width: moderateScale(20) }} />
                                                                    <Text style={[styles.txtheading, {
                                                                        color: sub.isSelected ? '#fff' : '#333'
                                                                    }]}>{sub.name}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        )
                                                    })

                                                    }
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            {/* <Text style={[styles.txtheading, { marginLeft: 0, marginVertical: moderateScaleVertical(5) }]}>Sports</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    Sports.map((item, index) => {
                                        return (
                                            <View key={index} style={{ flexDirection: 'row', margin: scale(5) }}>
                                                <TouchableOpacity style={[styles.Interestscontainer, {
                                                    backgroundColor: item.isSelected ? '#333' : '#fff',
                                                }]} onPress={() => handleSelect(item.id)}>
                                                    <Image source={item.Image} tintColor={item.isSelected ? '#fff' : '#333'} />
                                                    <Text style={[styles.txtheading, {
                                                        color: item.isSelected ? '#fff' : '#333'
                                                    }]}>{item.Name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <Text style={[styles.txtheading, { marginLeft: 0, marginVertical: moderateScaleVertical(5) }]}>Creativity</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    Creativity.map((item, index) => {
                                        return (
                                            <View key={index} style={{ flexDirection: 'row', margin: scale(5) }}>
                                                <TouchableOpacity style={[styles.Interestscontainer, {
                                                    backgroundColor: item.isSelected ? '#333' : '#fff',
                                                }]} onPress={() => handleSelect(item.id)}>
                                                    <Image source={item.Image} tintColor={item.isSelected ? '#fff' : '#333'} />
                                                    <Text style={[styles.txtheading, {
                                                        color: item.isSelected ? '#fff' : '#333'
                                                    }]}>{item.Name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <Text style={[styles.txtheading, { marginLeft: 0, marginVertical: moderateScaleVertical(5) }]}>Going out</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    Going_Out.map((item, index) => {
                                        return (
                                            <View key={index} style={{ flexDirection: 'row', margin: scale(5) }}>
                                                <TouchableOpacity style={[styles.Interestscontainer, {
                                                    backgroundColor: item.isSelected ? '#333' : '#fff',
                                                }]} onPress={() => handleSelect(item.id)}>
                                                    <Image source={item.Image} tintColor={item.isSelected ? '#fff' : '#333'} />
                                                    <Text style={[styles.txtheading, {
                                                        color: item.isSelected ? '#fff' : '#333'
                                                    }]}>{item.Name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <Text style={[styles.txtheading, { marginLeft: 0, marginVertical: moderateScaleVertical(5) }]}>Extracurricular</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    Extracurricular.map((item, index) => {
                                        return (
                                            <View key={index} style={{ flexDirection: 'row', margin: scale(5) }}>
                                                <TouchableOpacity style={[styles.Interestscontainer, {
                                                    backgroundColor: item.isSelected ? '#333' : '#fff',
                                                }]} onPress={() => handleSelect(item.id)}>
                                                    <Image source={item.Image} tintColor={item.isSelected ? '#fff' : '#333'} />
                                                    <Text style={[styles.txtheading, {
                                                        color: item.isSelected ? '#fff' : '#333'
                                                    }]}>{item.Name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <Text style={[styles.txtheading, { marginLeft: 0, marginVertical: moderateScaleVertical(5) }]}>Pets</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    Pets.map((item, index) => {
                                        return (
                                            <View key={index} style={{ flexDirection: 'row', margin: scale(5) }}>
                                                <TouchableOpacity style={[styles.Interestscontainer, {
                                                    backgroundColor: item.isSelected ? '#333' : '#fff',
                                                }]} onPress={() => handleSelect(item.id)}>
                                                    <Image source={item.Image} tintColor={item.isSelected ? '#fff' : '#333'} />
                                                    <Text style={[styles.txtheading, {
                                                        color: item.isSelected ? '#fff' : '#333'
                                                    }]}>{item.Name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </View> */}
                        </View>
                    </ScrollView>
                </View>
                <View>
                    <Modal
                        coverScreen={false}
                        isVisible={openModal}
                        style={{ justifyContent: 'flex-end', margin: 0 }}
                    >
                        <View style={styles.modalStyle}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.text}>Interests selected </Text>
                                <Text style={styles.Seletedtext}><Text style={[styles.Seletedtext, { color: '#049FD3' }]}>{selectedItems.length}</Text>/10</Text>
                            </View>
                            <View style={{
                                borderWidth: 0.2, borderBottomColor: '#828282'
                            }} />

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
                                            console.log("route=======", route?.params?.isFrom);
                                            if (route?.params?.isFrom == 'Main') {
                                                navigation.navigate(navigationStrings.SETTINGS)
                                            } else {
                                                navigation.navigate(navigationStrings.REKYC)
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
                    </Modal>
                </View>
            </WrapperContainer>

        </>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(12)
    },
    helpIcon: {
        // flex: 0.1,
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
    },
    Interestscontainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: scale(8),
        borderRadius: scale(50)

    },
    txtheading: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(12),
        fontWeight: '700',
        marginLeft: moderateScale(5)
    },
    modalStyle: {
        backgroundColor: '#FFF',
        minHeight: moderateScale(height / 4),
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: moderateScale(16),
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    text: {
        color: '#333',
        fontSize: scale(14),
        fontWeight: '700',
        fontFamily: 'Roboto'
    },
    Seletedtext: {
        color: '#828282',
        fontSize: scale(20),
        fontWeight: '700',
        fontFamily: 'Roboto'
    }


});

//make this component available to the app
export default Interests;

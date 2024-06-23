//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import imagePath from '../../constants/imagePath';
import { moderateScale, moderateScaleVertical, scale, textScale, height, width } from '../../styles/responsiveSize';
import IconLive from 'react-native-vector-icons/Octicons'
import ButtonComp from '../../Components/ButtonComp';
import IconsComment from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconUser from 'react-native-vector-icons/FontAwesome'
import navigationStrings from '../../Navigation/navigationStrings';
// create a component
const LiveEventsComponent = ({ item, index, date, Distance, onMarkComplete }) => {
    const navigation = useNavigation();


    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        {
                            item?.userId?.profilePicture ?
                                <>
                                    <Image source={{ uri: item?.userId?.profilePicture }} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                </>
                                :
                                <>
                                    <Image source={imagePath.Gola} resizeMode='contain' style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(25) }} />
                                </>
                        }
                        <Text style={styles.charlie}>{item?.userId?.fullName || 'NA'}</Text>
                    </View>

                    {/* <TouchableOpacity> */}
                    <IconLive name='broadcast' size={20} color='#EB5757' />
                    {/* </TouchableOpacity> */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.eventtxt}> <Text style={[styles.eventtxt, { color: '#333', fontWeight: '900' }]}>{item?.name ? item?.name : 'NA'}</Text>
                        </Text>
                    </View>
                </View>
                <View style={{ marginBottom: moderateScaleVertical(5) }}>
                    <Text style={[styles.eventtxt, { fontWeight: '500' }]}>{item?.description ? item?.description?.substring(0, 50) + '...' : 'NA'}</Text>
                </View>
                <View style={{ borderWidth: 0.5, borderColor: '#eee', marginVertical: moderateScaleVertical(2) }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='location-pin' size={15} color={'red'} />
                        {/* <Text style={[styles.eventtxt, { color: 'red' }]}>{Distance.toLocaleString().substring(0, 4)} km away </Text> */}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            // openGoogleMaps(UserLocation,Eventlocation);
                        }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={imagePath.Gmap} style={{ height: moderateScaleVertical(30), width: moderateScale(30) }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Text style={styles.eventtxt}>Event Type</Text>
                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item?.eventType ? item?.eventType : 'NA'}</Text>
                </View>
                {
                    item?.amount !== 0 &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                        <Text style={styles.eventtxt}>Amount</Text>
                        <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item?.amount ? item?.amount : 'NA'} $</Text>
                    </View>
                }
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <Text style={styles.eventtxt}>No. of People Required</Text>
                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}> Min: {item?.minPeople ? item?.minPeople : 'NA'}- Max: {item?.maxPeople ? item?.maxPeople : 'NA'}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <Text style={styles.eventtxt}>No. of Participant Approved</Text>
                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{item.event.bookingsApproved}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                    <Text style={styles.eventtxt}>Date & Time</Text>
                    <Text style={[styles.eventtxt, { fontWeight: '800' }]}>{date ? date[0] : 'NA'}, {item?.time?.start ? item?.time?.start : 'NA'} - {item?.time?.end ? item?.time?.end : 'NA'}</Text>
                </View>
                <View style={{ marginVertical: moderateScaleVertical(5) }}>
                    <Text style={[styles.eventtxt, { fontWeight: '500', color: '#333' }]}>Images</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginVertical: moderateScaleVertical(5) }}
                    >
                        {item?.images ?
                            item?.images && item?.images.map((item, index) => {
                                // console.log(item, 'images')
                                return (
                                    <View key={index} style={{ marginRight: moderateScale(5) }}>
                                        <Image source={{ uri: item }} style={{ borderRadius: scale(5), height: moderateScale(50), width: moderateScale(50), }} resizeMode='contain' />
                                    </View>
                                )
                            })
                            :
                            <>
                                <Image source={imagePath.pic1} style={{ borderRadius: scale(5), }} />
                                <Image source={imagePath.pic2} style={{ borderRadius: scale(5), marginLeft: moderateScale(5), }} />
                                <Image source={imagePath.pic3} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                                <Image source={imagePath.pic4} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                                <Image source={imagePath.pic1} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                                <Image source={imagePath.pic2} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                                <Image source={imagePath.pic3} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                                <Image source={imagePath.pic4} style={{ borderRadius: scale(5), marginLeft: moderateScale(5) }} />
                            </>
                        }
                    </ScrollView>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ width: '46%' }} >
                        <ButtonComp IconColor={'#005BD4'} text='Group Chat' midIcon={true} iconName='chat-outline' textStyle={{ color: '#005BD4', fontSize: textScale(18) }} style={{ borderColor: '#005BD4', borderWidth: textScale(1.7), marginTop: moderateScaleVertical(10) }} />
                    </View>
                    <View style={{ width: '46%' }} >
                        <ButtonComp onPress={() => navigation.navigate(navigationStrings.SCANNER, { data: item?._id })} IconColor={'#005BD4'} text='Scan' midIcon={true} iconName='qrcode-scan' textStyle={{ color: '#005BD4', fontSize: textScale(18) }} style={{ borderColor: '#005BD4', borderWidth: textScale(1.7), marginTop: moderateScaleVertical(10) }} />
                    </View>
                </View>
                <View style={{ width: '80%', alignSelf: "center" }} >
                    <ButtonComp
                        IconColor={'#005BD4'}
                        text='Complete'
                        midIcon={true}
                        // iconName='chat-outline'
                        textStyle={{ color: '#005BD4', fontSize: textScale(18) }}
                        style={{
                            borderColor: '#005BD4', borderWidth: textScale(1.7),
                            marginTop: moderateScaleVertical(10)
                        }}
                        onPress={() => {
                            onMarkComplete(item?._id || "1323")
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: moderateScale(5),
        // backgroundColor: '#fff',
        // marginVertical: moderateScaleVertical(10)
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#2c3e50',
    },
    container2: {
        flex: 1,
        backgroundColor: '#fff',
        // elevation: 2,

        marginHorizontal: moderateScale(5),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(12),
        elevation: 3,
        marginVertical: moderateScaleVertical(10),
        borderRadius: moderateScale(5),
    },
    eventtxt: {
        color: '#4F4F4F',
        fontSize: scale(14),
        fontWeight: '500'
    },
    charlie: {
        color: '#333',
        fontSize: scale(20),
        fontFamily: 'Roboto',
        fontWeight: '700',
        marginLeft: moderateScale(10)
    },
    modalStyle: {
        backgroundColor: '#FFF',
        minHeight: moderateScale(height / 2.5),
        borderRadius: moderateScale(15),
        justifyContent: 'space-between',
        padding: moderateScale(16)
    },
    modalStyle2: {

        width: '40%',
        backgroundColor: '#fff',
        position: 'absolute',
        right: 40,
        top: 50,
        borderRadius: 10,
        padding: moderateScale(15),
        zIndex: 1

    },
    qrCode: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(20),
        fontWeight: '700'
    }
});

//make this component available to the app
export default LiveEventsComponent;

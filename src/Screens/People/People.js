//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import HeaderBack from '../../Components/HeaderBack';
import ButtonComp from '../../Components/ButtonComp';
import WrapperContainer from '../../Components/WrapperContainer';
// create a component
const People = () => {
    const [Gcategory, setGcategory] = useState(1)
    const handleCategory = (id) => {
        setGcategory(id)
    }

    const Data = [
        {
            id: 1,
            Name: 'Charlie Harper',
            img: imagePath.Frame3
        },
        {
            id: 2,
            Name: 'Charlie Harper',
            img: imagePath.Frame3
        },
        {
            id: 3,
            Name: 'Charlie Harper',
            img: imagePath.Frame3
        },
        {
            id: 4,
            Name: 'Charlie Harper',
            img: imagePath.Frame3
        },
        {
            id: 5,
            Name: 'Charlie Harper',
            img: imagePath.Frame3
        },
        {
            id: 6,
            Name: 'Charlie Harper',
            img: imagePath.Frame3
        },
        {
            id: 7,
            Name: 'Charlie Harper',
            img: imagePath.Frame3
        },
        {
            id: 8,
            Name: 'Charlie Harper',
            img: imagePath.Frame3
        },
        {
            id: 9,
            Name: 'Charlie Harper',
            img: imagePath.Frame3
        },
        {
            id: 10,
            Name: 'Charlie Harper',
            img: imagePath.Frame3
        },
    ]

    const category = [{
        id: 1,
        cat: 'All'
    },
    {
        id: 2,
        cat: 'People you Follow'
    },
    {
        id: 3,
        cat: 'Your Followers'
    },
    ]
    return (
        <WrapperContainer>
            <View style={styles.container}>
                <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
                <HeaderBack mainText='People you follow' isLeftImage={true} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: moderateScale(5), }}>
                    <Image source={imagePath.filter} tintColor={'#333'} resizeMode='contain' style={{ height: moderateScale(20), width: moderateScale(20) }} />
                    <FlatList
                        data={category}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => handleCategory(item.id)}
                                    key={index} style={{ backgroundColor: item.id === Gcategory ? '#F2F2F2' : '#fff', padding: moderateScale(8), borderRadius: scale(10), elevation: 3, marginHorizontal: scale(5), marginVertical: moderateScaleVertical(5) }}>
                                    <Text style={[styles.catstyle, { color: item.id === Gcategory ? 'black' : '#828282', fontWeight: item.id === Gcategory ? '800' : '500' }]}>{item.cat}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>

                    <Text style={styles.heading}>{Gcategory == '1' && 'Friend Requests (21)' || Gcategory == '2' && 'People you Follow (285)' || Gcategory == '3' && 'Your Followers'}</Text>
                    <Image source={imagePath.slider} />
                </View>
                <View>
                    <FlatList
                        data={Data}
                        scrollEnabled
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    {Gcategory == 1 &&
                                        <View key={index} style={{
                                            backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10),
                                            marginBottom: Data.length - 1 === index ? moderateScaleVertical(175) : 0
                                        }}>
                                            <View style={{ flex: 0.2 }}>
                                                <Image source={item.img} />
                                            </View>
                                            <View style={{ flex: 0.4 }}>
                                                <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text style={[styles.heading]}>{item.Name}</Text>
                                                    <Text style={[styles.catstyle, , { marginVertical: scale(3) }]}>15 mutual friends</Text>
                                                    <ButtonComp text='Delete' style={{ borderWidth: 1, borderColor: '#005BD4', width: '90%', height: 30 }} textStyle={{ color: '#005BD4' }} />
                                                </View>
                                            </View>
                                            <View style={{ flex: 0.4 }}>
                                                <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text style={[styles.catstyle, { alignSelf: 'flex-end' }]}>2 days ago</Text>
                                                    <Image source={imagePath.groupFrame} style={{ alignSelf: 'flex-end', marginVertical: scale(3) }} />
                                                    <ButtonComp text='Confirm' style={{ backgroundColor: '#005BD4', width: '90%', height: 30 }} />
                                                </View>
                                            </View>

                                        </View>
                                    }
                                    {
                                        Gcategory == 2 &&
                                        <View key={index} style={{
                                            backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10),
                                            marginBottom: Data.length - 1 === index ? moderateScaleVertical(175) : 0
                                        }}>
                                            <View style={{ flex: 0.2 }}>
                                                <Image source={item.img} />
                                            </View>
                                            <View style={{ flex: 0.8, marginLeft: moderateScale(10) }}>
                                                <Text style={[styles.heading]}>{item.Name}</Text>
                                                <Text style={[styles.catstyle, , { marginVertical: scale(3) }]}>15 mutual friends</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Image source={imagePath.trash} />
                                                    <Image source={imagePath.Useradd} />
                                                    <ButtonComp text='Visit Profile' style={{ borderWidth: 1, borderColor: '#005BD4', width: '70%', height: 30 }} textStyle={{ color: '#005BD4' }} />
                                                </View>
                                            </View>
                                        </View>
                                    }
                                    {Gcategory == 3 &&
                                        <View key={index} style={{
                                            backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10),
                                            marginBottom: Data.length - 1 === index ? moderateScaleVertical(175) : 0
                                        }}>
                                            <View style={{ flex: 0.2 }}>
                                                <Image source={item.img} />
                                            </View>
                                            <View style={{ flex: 0.8, marginLeft: moderateScale(10) }}>
                                                <Text style={[styles.heading]}>{item.Name}</Text>
                                                <Text style={[styles.catstyle, , { marginVertical: scale(3) }]}>15 mutual friends</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <ButtonComp text='Remove' style={{ borderWidth: 1, borderColor: '#005BD4', height: 30, width: '47%' }} textStyle={{ color: '#005BD4' }} />
                                                    <ButtonComp text='Follow' style={{ backgroundColor: '#005BD4', height: 30, width: '47%' }} textStyle={{ color: '#fff' }} />
                                                </View>
                                            </View>
                                        </View>
                                    }
                                    {Gcategory == 4 &&
                                        <View key={index} style={{
                                            backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10),
                                            marginBottom: Data.length - 1 === index ? moderateScaleVertical(175) : 0
                                        }}>
                                            <View style={{ flex: 0.2 }}>
                                                <Image source={item.img} />
                                            </View>
                                            <View style={{ flex: 0.8, marginLeft: moderateScale(10) }}>
                                                <Text style={[styles.heading]}>{item.Name}</Text>
                                                <Text style={[styles.catstyle, , { marginVertical: scale(3) }]}>15 mutual friends</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Image source={imagePath.trash} style={{ marginLeft: moderateScale(5) }} />
                                                    <ButtonComp text='Unsend Request' style={{ borderWidth: 1, borderColor: '#005BD4', height: 30, width: '85%' }} textStyle={{ color: '#005BD4' }} />
                                                </View>
                                            </View>
                                        </View>
                                    }
                                </>
                            )
                        }}
                    />
                </View>
            </View>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: moderateScale(12)
    },
    catstyle: {
        color: '#828282',
        fontFamily: 'Roboto',
        fontSize: scale(12),
        fontWeight: '600'
    },
    heading: {
        color: '#333',
        fontFamily: 'Roboto',
        fontSize: scale(16),
        fontWeight: '800'
    }
});

//make this component available to the app
export default People;

//import liraries
import React, { useState } from 'react';
import { View, Text, StyleSheet,  StatusBar, TouchableOpacity, FlatList, Image } from 'react-native';
import { moderateScale, moderateScaleVertical, scale } from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import HeaderBack from '../../Components/HeaderBack';
import ButtonComp from '../../Components/ButtonComp';
import TextInputC from '../../Components/TextInputC';
import { SafeAreaView } from 'react-native-safe-area-context';
// create a component
const Search = () => {
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


    return (
        <View style={styles.container}>
            <SafeAreaView>
                <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:moderateScale(50)}}>
                <HeaderBack  isLeftImage={true}  />
                <TextInputC imgsrc={imagePath.search} placeholder={'Search'} imgright={true} style={{backgroundColor:'#F2F2F2',flex:0.95,borderRadius:moderateScale(5)}}/>
                <Image source={imagePath.slider} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                    <Text style={styles.heading}>Previous Searches</Text>
                </View>
                <View>
                    <FlatList
                        data={Data}
                        scrollEnabled
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    
                                        <View key={index} style={{
                                            backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10),
                                            marginBottom: Data.length - 1 === index ? moderateScaleVertical(200) : 0
                                        }}>
                                            <View style={{ flex: 0.2 }}>
                                                <Image source={item.img} />
                                            </View>
                                            <View style={{ flex: 0.8, marginLeft: moderateScale(10) }}>
                                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                                    <View>
                                                <Text style={[styles.heading]}>{item.Name}</Text>
                                                <Text style={[styles.catstyle, , { marginVertical: scale(3) }]}>15 mutual friends</Text>
                                                </View>
                                                <Image source={imagePath.dotted}/>
                                                </View>

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <ButtonComp text='Remove' style={{ borderWidth: 1, borderColor: '#EB5757', height: 30, width: '47%' }} textStyle={{ color: '#EB5757' }} />
                                                    <ButtonComp text='Follow' style={{borderWidth: 1, borderColor: '#005BD4', height: 30, width: '47%' }} textStyle={{ color: '#005BD4' }} />
                                                </View>
                                            </View>
                                        </View>
                                </>
                            )
                        }}
                    />
                </View>
            </SafeAreaView>
        </View>
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
export default Search;

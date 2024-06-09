//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale, moderateScaleVertical, textScale } from '../../styles/responsiveSize';
import Loader from '../../Components/Loader';
import ButtonComp from '../../Components/ButtonComp';
import { getData } from '../../utils/helperFunctions';
import axios from 'axios';

// create a component
const PackagePurchased = () => {
    const [LoadEvent, setLoadEvent] = useState(false)
    const [PlanList, setPlanList] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
       getpackageList()
    }, [])


    const handleSelect = (item) => {
        console.log(item, 'selection m')

    }

    const getpackageList = async (pageNumber) => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        try {
            let usertoken = await getData('UserToken');
            console.log('userToken', usertoken)
            const headers = {
                'Authorization': `Bearer ${usertoken}`,
                'Content-Type': "application/json",
            };

            const response = await axios.get(`https://plansaround-backend.vercel.app/api/mobile/packages/purchase-history`, { headers });
            const responseData = response.data;
            console.log(responseData, 'totalPackages')
            const packageList = responseData?.history;
            setPlanList(packageList)
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };


    return (
        <WrapperContainer>
            <HeaderBack mainText='Membership Package Details' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            <View style={styles.container}>
                {
                    isLoading ? <Loader/> : (
                        PlanList.length > 0  ? PlanList.map((item, index)=>{
                            return(
                                <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(20), width: '100%' }}>
                                <View>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(18), textAlign: 'center' }]}>{item?.title}</Text>
                                    <Image source={{ uri: item?.image }} style={{ height: moderateScaleVertical(150), width: moderateScale(150), borderRadius: moderateScale(75), alignSelf: 'center', marginVertical: moderateScaleVertical(10) }} />
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(14), fontWeight: '400', marginVertical: moderateScaleVertical(10) }]}>{item?.shortDescription}</Text>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(14), fontWeight: '400', marginVertical: moderateScaleVertical(10) }]}>{item?.longDescription}</Text>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(18), marginBottom: moderateScaleVertical(10) }]}>Amount: {item?.amount}$</Text>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(18), marginBottom: moderateScaleVertical(10) }]}>Validity: {item?.noOfDays}</Text>
                                </View>
                            </View>
                            )

                        }) : <Text style={[styles.phoneHeading, { fontSize: textScale(18), textAlign: 'center' }]}>{'No Details'}</Text>
                    )
                }
            </View>
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(12),
        backgroundColor: '#F2F2F2',
       // justifyContent: 'center',
       // alignItems: 'center'
    },
});

//make this component available to the app
export default PackagePurchased;

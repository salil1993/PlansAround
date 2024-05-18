//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import HeaderBack from '../../Components/HeaderBack';
import { moderateScale } from '../../styles/responsiveSize';

// create a component
const PackagePurchased = () => {
    return (
        <WrapperContainer>
            <HeaderBack mainText='Membership Package Details' style={{ backgroundColor: '#fff', paddingHorizontal: moderateScale(10) }} />
            <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
            {/* <View style={styles.container}>
                {
                    LoadEvent ? <Loader /> : (
                        Plan && Plan ?
                            <View style={{ backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(20), width: '100%' }}>
                                <View>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(18), textAlign: 'center' }]}>{Plan[0]?.title}</Text>
                                    <Image source={{ uri: Plan[0].image }} style={{ height: moderateScaleVertical(150), width: moderateScale(150), borderRadius: moderateScale(75), alignSelf: 'center', marginVertical: moderateScaleVertical(10) }} />
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(14), fontWeight: '400', marginVertical: moderateScaleVertical(10) }]}>{Plan[0].shortDescription}</Text>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(14), fontWeight: '400', marginVertical: moderateScaleVertical(10) }]}>{Plan[0].longDescription}</Text>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(18), marginBottom: moderateScaleVertical(10) }]}>Amount: {Plan[0].amount}$</Text>
                                    <Text style={[styles.phoneHeading, { fontSize: textScale(18), marginBottom: moderateScaleVertical(10) }]}>Validity: {Plan[0].noOfDays}</Text>
                                </View>
                                <ButtonComp text='Pay Now' isLoading={Loading} onPress={() => handleSelect(Plan[0]._id)} style={{ backgroundColor: '#005BD4', }} />
                            </View>
                            :
                            <Text style={[styles.phoneHeading, { fontSize: textScale(18), textAlign: 'center' }]}>{'No Details'}</Text>
                    )
                }
            </View> */}
        </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(12),
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

//make this component available to the app
export default PackagePurchased;

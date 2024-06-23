//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { moderateScale, scale, textScale, moderateScaleVertical } from '../styles/responsiveSize';
import imagePath from '../constants/imagePath';
import * as Progress from 'react-native-progress';

// create a component
const Reputation = ({attendence, reviewDetail}) => {
    console.log('attendence--->>', attendence)

    return (
        <>
            <View style={[styles.container, { paddingBottom: moderateScaleVertical(15) }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.txt}>Reputation</Text>
                </View>
                <View style={{ borderWidth: 0.5, borderColor: '#C0C0C0', marginVertical: moderateScaleVertical(10) }} />
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                        <Text style={[styles.txt,{fontWeight:'500'}]}>Attendances ({attendence[0]?.approvedAndAttended == undefined ? 0 :attendence[0]?.approvedAndAttended})</Text>
                        <Text style={[styles.txt,{fontWeight:'500'}]}>{attendence[0]?.percentage == null ? 0:attendence[0]?.percentage}%</Text>
                    </View>
                    <Progress.Bar
                        progress={attendence[0]?.percentage == null ?0:attendence[0]?.percentage }
                        width={null}
                        height={moderateScaleVertical(25)}
                        borderRadius={moderateScale(8)}
                        borderWidth={2} />
                </View>
            </View>
           {reviewDetail?.length > 0 && <View style={[styles.container, { marginTop: moderateScaleVertical(15) }]}>
                <View>
                    <Text style={styles.txt}>Top Quality</Text>
                    <View style={{ borderWidth: 0.5, borderColor: '#C0C0C0', marginVertical: moderateScaleVertical(15) }} />
                </View>
                <FlatList
                            style={{ marginTop: 10, marginBottom: 20 }}
                            data={reviewDetail}
                            numColumns={2}
                            scrollEnabled={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#828282', padding: moderateScale(8), borderRadius: moderateScale(5) }}>
                                            <Text style={[styles.txt, { color: '#fff', fontWeight: '700', }]}>{item?.reviewName}</Text>
                                            <Text style={[styles.txt, { color: '#fff', fontWeight: '500', }]}>{'(' + item?.averageRating + ')'}</Text>
                                        </View>
                                    </View>
                                )
                            }}
                            ItemSeparatorComponent={<View style={{ height: 1, width: "100%", backgroundColor: "#cfecf7" }} />}
                        />
               
            </View>}
        </>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: moderateScale(8),
        borderRadius: moderateScale(10)
    },
    txt: {
        color: '#4F4F4F',
        fontFamily: 'Roboto',
        fontSize: scale(14),
        fontWeight: '700'
    },

});

//make this component available to the app
export default Reputation;

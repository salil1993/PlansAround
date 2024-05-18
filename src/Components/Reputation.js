//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { moderateScale, scale, textScale, moderateScaleVertical } from '../styles/responsiveSize';
import imagePath from '../constants/imagePath';
import * as Progress from 'react-native-progress';

// create a component
const Reputation = () => {
    const [RepuProgress, setRepuProgress] = useState(0.7)
    const [AttProgress, setAttProgress] = useState(0.9)
    return (
        <>
            <View style={[styles.container, { paddingBottom: moderateScaleVertical(15) }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.txt}>Reputation</Text>
                </View>
                <View style={{ borderWidth: 0.5, borderColor: '#C0C0C0', marginVertical: moderateScaleVertical(10) }} />
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: moderateScaleVertical(5) }}>
                        <Text style={[styles.txt,{fontWeight:'500'}]}>Attendances (131)</Text>
                        <Text style={[styles.txt,{fontWeight:'500'}]}>{AttProgress * 100}%</Text>
                    </View>
                    <Progress.Bar
                        progress={AttProgress}
                        width={null}
                        height={moderateScaleVertical(25)}
                        borderRadius={moderateScale(8)}
                        borderWidth={2} />
                </View>
            </View>
            <View style={[styles.container, { marginTop: moderateScaleVertical(15) }]}>
                <View>
                    <Text style={styles.txt}>Top Quality</Text>
                    <View style={{ borderWidth: 0.5, borderColor: '#C0C0C0', marginVertical: moderateScaleVertical(15) }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#828282', width: '40%', padding: moderateScale(8), borderRadius: moderateScale(5) }}>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '700',  }]}>Nice</Text>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '500',  }]}>(12)</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#828282', width: '40%', padding: moderateScale(8), borderRadius: moderateScale(5) }}>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '700',  }]}>Sociable</Text>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '500', }]}>(11)</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#828282', width: '40%', padding: moderateScale(8), borderRadius: moderateScale(5) }}>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '700',  }]}>Positive</Text>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '500',  }]}>(16)</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#828282', width: '40%', padding: moderateScale(8), borderRadius: moderateScale(5) }}>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '700', }]}>Humble</Text>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '500', }]}>(8)</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#828282', width: '40%', padding: moderateScale(8), borderRadius: moderateScale(5) }}>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '700',  }]}>Intelligent</Text>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '500', }]}>(16)</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#828282', width: '40%', padding: moderateScale(8), borderRadius: moderateScale(5) }}>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '700',  }]}>Funny</Text>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '500',}]}>(8)</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: moderateScaleVertical(10) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#828282', width: '40%', padding: moderateScale(8), borderRadius: moderateScale(5) }}>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '700',  }]}>Versatile</Text>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '500',  }]}>(16)</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#828282', width: '40%', padding: moderateScale(8), borderRadius: moderateScale(5) }}>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '700',  }]}>Hearty</Text>
                        <Text style={[styles.txt, { color: '#fff', fontWeight: '500',  }]}>(8)</Text>
                    </View>
                </View>
            </View>
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

import { View, Text, ImageBackground, StyleSheet, StatusBar, SafeAreaView, Image } from 'react-native'
import React, { useEffect } from 'react'
import imagePath from '../../constants/imagePath'
import { moderateScale } from '../../styles/responsiveSize'
import { useDispatch, useSelector } from 'react-redux'
import { getData } from '../../utils/helperFunctions'
import { userStatus } from '../../redux/Slices/UserSlice'
import navigationStrings from '../../Navigation/navigationStrings'

const SplashScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    useEffect(() => {
        console.log("navigation==", navigation);
        checkUserStatus()
        return (() => { })
    }, [])

    const checkUserStatus = async () => {
        const token = await getData('UserToken');
        if (token) {
            dispatch(userStatus(true))
        }
        setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: token ? navigationStrings.TABROUTES : navigationStrings.INITIAL_SCREEN }]
            })
        }, 1000)
    }
    return (
        <ImageBackground source={imagePath.Splash} style={styles.backgroundImage}>
            <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />
            <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Image source={imagePath.Logo} style={styles.logo} resizeMode='contain' />
            </SafeAreaView>
        </ImageBackground>
    )
}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        // opacity:0.8
    },

    logo: {
        height: moderateScale(150),
        width: moderateScale(150),
    },


});

export default SplashScreen
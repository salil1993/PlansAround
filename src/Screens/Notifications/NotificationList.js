import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import WrapperContainer from '../../Components/WrapperContainer'
import HeaderBack from '../../Components/HeaderBack'
import { height, moderateScale, moderateScaleVertical, scale, textScale, width } from '../../styles/responsiveSize'
import Iconsetting from 'react-native-vector-icons/MaterialIcons'

const NotificationList = () => {
    return (
        <WrapperContainer style={{ backgroundColor: '#fff' }}>
            <HeaderBack style={{ marginLeft: moderateScale(10) }} mainText='Notifications' maintxtstyle={{ fontSize: textScale(18) }} />

            <FlatList
                data={[]}
                renderItem={({ item }) => {
                    return <View style={{
                        borderWidth: 0.3,
                        paddingHorizontal: 8,
                        marginHorizontal: 10,
                        paddingVertical: 5,
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <View style={{ padding: 5, backgroundColor: "#005BD4A1", borderRadius: 20 }}>
                            <Iconsetting name='notifications' size={20} color='#4F4F4F' />
                        </View>
                        <View style={{ marginLeft: 7, flex: 1 }}>
                            <Text

                                style={{
                                    fontSize: scale(15),
                                    color: '#4F4F4F',
                                    fontWeight: '700',
                                }}>{item.name}</Text>
                            <Text
                                style={{
                                    alignSelf: "flex-end",
                                    fontSize: scale(9),
                                    color: '#4F4F4F',
                                    fontWeight: '500'
                                }}>{item.name}</Text>
                        </View>

                    </View>
                }}
                ListEmptyComponent={<View
                    style={{
                        height: height,
                        width: width,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}><Text style={{
                        fontSize: scale(15),
                        color: '#4F4F4F',
                        fontWeight: '700',
                        marginBottom: moderateScaleVertical(200)
                    }}>No record found.</Text></View>}
            />
        </WrapperContainer>
    )
}

export default NotificationList
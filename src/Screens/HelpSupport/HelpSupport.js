import { View, Text } from 'react-native'
import React, { useState } from 'react'
import WrapperContainer from '../../Components/WrapperContainer'
import HeaderBack from '../../Components/HeaderBack'
import { height, moderateScale, moderateScaleVertical, textScale } from '../../styles/responsiveSize'
import TextInputC from '../../Components/TextInputC'
import imagePath from '../../constants/imagePath'
import ButtonComp from '../../Components/ButtonComp'

const HelpSupport = ({ navigation }) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    return (
        <WrapperContainer style={{ backgroundColor: '#fff' }}>
            <HeaderBack
                style={{ marginLeft: moderateScale(10) }}
                mainText='Help & Support'
                maintxtstyle={{ fontSize: textScale(18) }} />
            <View style={{
                flex: 1,
                margin: moderateScaleVertical(15),
            }}>


                <TextInputC
                    placeholder={'Title'}
                    style={{
                        height: 70,
                        marginTop: moderateScaleVertical(10)
                    }}
                    editable={true}
                    keyBoardType={'default'}
                    value={title}
                    onChangeText={setTitle}

                />
                <TextInputC
                    placeholder={'Description'}
                    editable={true}
                    keyBoardType={'email-address'}
                    style={{
                        height: 250,
                        marginTop: moderateScaleVertical(10)
                    }}
                    value={description}
                    onChangeText={setDescription}
                />
                <ButtonComp
                    onPress={() => {
                        alert("Feedback Added")
                        navigation.goBack()
                    }}
                    text='Submit
                 ' style={{ backgroundColor: '#005BD4', marginVertical: moderateScaleVertical(10) }} />

            </View>
        </WrapperContainer>
    )
}

export default HelpSupport
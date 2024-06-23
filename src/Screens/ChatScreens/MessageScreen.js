import { View, Text, StatusBar, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import WrapperContainer from '../../Components/WrapperContainer'
import HeaderBack from '../../Components/HeaderBack'
import { moderateScale } from '../../styles/responsiveSize'
import colors from '../../styles/colors'
import useMessage from './useMessage'
import { hasDynamicIsland, hasNotch } from 'react-native-device-info'
import { useKeyboard } from './useKeyboard'
import imagePath from '../../constants/imagePath'
import ChatItem from './ChatItem'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { getData } from '../../utils/helperFunctions'

const MessageScreen = () => {
  const dispatch = useDispatch();
  const User = useSelector((state) => state.persistedReducer.authSlice.userData);
  const [isLoading, setIsLoading] = useState(false);
  const { paginationLoader, 
    roomMessageList, 
    loadMoreRandomData, 
    flatListRef,
    onSend,
    msg,
    setMsg,
    profileData
  }=useMessage()
  const dynamicHight = hasDynamicIsland() || hasNotch() ? 25 : 0;
  const {keyboardHeight, isKeyboardOpen} = useKeyboard();
  const [messageData,setMessageData] = useState([])
  useEffect(() => {
    getChats()
}, [])

  const getChats = async () => {
    if (isLoading) {
        return;
    }
    setIsLoading(true);
    let usertoken = await getData('UserToken');
    console.log(usertoken, 'token')
    const headers = {
        'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzAyNTE5MzYzNjZmMjFhMGU5OTljNCIsInBob25lTnVtYmVyIjoiNzY1NDMyMTg5MCIsImVtYWlsIjoicGFydGljaXBhbnRAeW9wbWFpbC5jb20iLCJpYXQiOjE3MTg2MjU1NjEsImV4cCI6MTcyMTIxNzU2MX0.P2TOKJ82Im28c2uUO0rmGWVzqC4_zgFRcBI-jgiIrcM'}`,
       // 'Content-Type': "application/json",
    };
    let EndPoint = `https://plansaround-backend.vercel.app/api/mobile/message/665df61915a633e11adaf987?page=1&limit=10`
    console.log('EndPoint', EndPoint)
    axios.get(EndPoint, { headers })
        .then((res) => {
            const responseData = res?.data?.messages?.docs;
            setMessageData(responseData)
            console.log('responseData', JSON.stringify(responseData))
            setIsLoading(false);
        }).
        catch((err) => {
            console.log(err.response.data.message)
            setIsLoading(false);
        })
};


  const renderItem = ({item, index}) => {
    return <ChatItem item={item} senderId={User?._id} />;
  };

  const emptyList = () => {
    return (
      <Text style={styles.noChat}>
        { 'No chat found'}
      </Text>
    );
  };

  return (
    <WrapperContainer>
    <StatusBar backgroundColor={'#fff'} />
    <View style={styles.container}>
        <HeaderBack mainText='User Name' isLeftImage={true} />
        <View style={styles.border} />
        <View style={{flex: 1}}>
          {paginationLoader && (
            <ActivityIndicator size={'large'} animating={paginationLoader} />
          )}
          {roomMessageList.length == 0 && emptyList()}
          <FlatList
            ref={flatListRef}
            contentContainerStyle={styles.flatListCotainer}
            data={messageData}
            keyExtractor={(item, index) => index + ''}
            renderItem={renderItem}
            inverted
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.1}
            onEndReached={loadMoreRandomData}
            // onContentSizeChange={contentSizeChange}
            // ListEmptyComponent= {emptyList}
          />
        </View>
        <View
          style={[
            styles.inputContainer,
            {
              marginBottom: isKeyboardOpen
                ? keyboardHeight - dynamicHight
                : hasDynamicIsland()
                ? 0
                : 10,
            },
          ]}>
          <View style={styles.msgInput}>
            <TextInput
              value={msg}
              multiline={true}
              placeholder={'Message'}
              style={styles.txtStyle}
              onChangeText={txt => {
                setMsg(txt);
              }}
            />
          </View>

          <TouchableOpacity
            style={{padding: 5}}
            onPress={onSend}>
            <Image
              style={{
                height: 30,
                width: 30,
                tintColor: colors.appPrimary,
              }}
              source={imagePath.sendButton}
            />
          </TouchableOpacity>
        </View>

        </View>
        </WrapperContainer>
  )
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: moderateScale(12),
      backgroundColor: '#fff'
  },
  flatListCotainer: {
    flexGrow: 1,
  },
  userImage: {
    width: 30,
    height: 30,
    overflow: 'hidden',
    backgroundColor: 'gray',
    borderRadius: 20,
  },
  greenDot: {
    height: 8,
    width: 8,
    backgroundColor: 'green',
    borderRadius: 20,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  userName: {
    color: '#4A4A4A',
    fontSize: 15,
    fontWeight: '500',
  },
  msgTime: {
    color: 'gray',
    fontSize: 12,
  },
  txtStyle: {
    fontSize: 15,
    color:colors.black
  },
  msg: {
    color: '#706F6F',
    fontSize: 14,
    letterSpacing: 1,
  },
  singleMsgView: {
    minWidth: 50,
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#fff',
  },
  headerUserImage: {width: 32, height: 32, borderRadius: 20, marginStart: 5},
  inputContainer: {
    // width: '',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    bottom: 0,
    maxHeight: 100,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  msgInput: {
    width: '87%',
    minHeight: 45,
    borderColor: '#E8E6EA',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    justifyContent: 'center',
    paddingVertical: 5,
  },

  border: {
    width: '100%',
    marginHorizontal: 0,
    height: 1,
    backgroundColor: '#DDD',
    alignSelf: 'center',
  },
  sendBtnContainer: {
    width: 80,
    height: 30,
    backgroundColor: '#375DD0',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  headerConatiner: {
    alignItems: 'center',
    paddingTop: 15,
    width: '100%',
    justifyContent: 'center',
  },
  headerImagesConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    marginTop: 5,
    marginBottom: 10,
  },
  menuOptions: {
    padding: 50,
  },
  menuTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  triggerText: {
    fontSize: 14,
    marginStart: 10,
  },
  contentText: {
    fontSize: 18,
  },
  userPic: {
    height: 55,
    width: 55,
    borderRadius: 30,
  },
  userName: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 21,
    marginTop: 10,
  },
  backContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 20,
  },
  backButton: {
    color: colors.black,
    fontWeight: '400',
    fontSize: 17,
    padding: 8,
  },
  noChat: {
    alignSelf: 'center',
    marginTop: 30,
  },


});

export default MessageScreen
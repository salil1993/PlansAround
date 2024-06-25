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
import { useSelector } from 'react-redux'


const MessageScreen = ({route}) => {
  const User = useSelector((state) => state.persistedReducer.authSlice.userData);
  const { paginationLoader, 
    roomMessageList, 
    handleLoadMore, 
    flatListRef,
    onSend,
    msg,
    setMsg,
    hasMore,
    isLoading
  }=useMessage()
  const dynamicHight = hasDynamicIsland() || hasNotch() ? 25 : 0;
  const {keyboardHeight, isKeyboardOpen} = useKeyboard();


  const renderItem = ({item, index}) => {
    return <ChatItem item={item} senderId={User?._id} />;
  };

  const LoaderList = () => (
    <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#005BD4" />
        <Text style={[styles.eventtxt, { color: '#005BD4' }]}>Loading</Text>
    </View>
);


  const emptyList = () => {
    return (
      <Text style={styles.noChat}>
        { 'No chat found'}
      </Text>
    );
  };

  console.log("paginationLoader=",paginationLoader);
  return (
    <WrapperContainer>
    <StatusBar backgroundColor={'#fff'} />
    <View style={styles.container}>
        <HeaderBack mainText={route?.params?.item?.eventDetail?.name} isLeftImage={true} />
        <View style={styles.border} />
        <View style={{flex: 1}}>
          {paginationLoader && (
            <ActivityIndicator size={'large'} animating={paginationLoader} />
          )}
          {roomMessageList.length == 0 && emptyList()}
          <FlatList
            ref={flatListRef}
            contentContainerStyle={styles.flatListCotainer}
            data={roomMessageList}
            keyExtractor={(item, index) => index + ''}
            renderItem={renderItem}
            inverted
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={isLoading ? <LoaderList /> : null}
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
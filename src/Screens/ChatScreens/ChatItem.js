import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import moment from 'moment';
import colors from '../../styles/colors';
import { DUMMY_USER_URL } from '../../API/Api';
function ChatItemMemo({item, senderId}) {
  let isRightView = item.senderId == senderId;
  return (
    <View style={{marginHorizontal: 10}}>
      <View
        style={{
          marginTop: 10,
          alignSelf: isRightView ? 'flex-end' : 'flex-start',
          flexDirection: isRightView ? 'row-reverse' : 'row',
        }}>
        <View style={{justifyContent: 'flex-end', marginRight: 5}}>
          
              <Image
                style={styles.userImage}
                source={{
                  uri: item?.sender?.profilePicture || DUMMY_USER_URL,
                }}
              />
        </View>
        <View
          style={[
            styles.singleMsgView,
            isRightView
              ? {
                  borderBottomRightRadius: 0,
                  backgroundColor: colors?.appPrimary,
                }
              : {
                  borderBottomLeftRadius: 0,
                  backgroundColor: colors?.lightGray,
                },
          ]}>
          <Text
            style={[
              styles.msg,
              {color: isRightView ? colors.white : colors?.black},
            ]}>
            {item.message}
          </Text>
        </View>
      </View>
      {!isRightView && <Text
      numberOfLines={1}
        style={{
          marginHorizontal: 10,
          alignSelf: isRightView ? 'flex-end' : 'flex-start',
          fontWeight: '400',
          fontSize: 9,
          marginBottom: 5,
          marginTop: 3,
          width: 80
        }}>
        {item?.sender?.fullName}
      </Text>}
      <Text
        style={{
          marginHorizontal: 10,
          alignSelf: isRightView ? 'flex-end' : 'flex-start',
          fontWeight: '400',
          fontSize: 8,
          marginBottom: 5,
        }}>
        {moment(item.createdAt).format('DD MMM hh:mm a')}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  singleMsgView: {
    minWidth: 50,
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#fff',
  },
  userImage: {
    width: 30,
    height: 30,
    overflow: 'hidden',
    backgroundColor: 'gray',
    borderRadius: 20,
  },
})
const ChatItem = React.memo(ChatItemMemo);
export default ChatItem;

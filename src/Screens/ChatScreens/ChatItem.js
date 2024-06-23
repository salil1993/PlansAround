import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import moment from 'moment';
import colors from '../../styles/colors';
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
        <View style={{justifyContent: 'flex-end'}}>
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
            {item.content}
          </Text>
        </View>
      </View>
      <Text
        style={{
          marginHorizontal: 10,
          alignSelf: isRightView ? 'flex-end' : 'flex-start',
          fontWeight: '400',
          fontSize: 10,
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
})
const ChatItem = React.memo(ChatItemMemo);
export default ChatItem;

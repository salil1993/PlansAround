import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import moment from 'moment';
import { DUMMY_USER_URL } from '../../API/Api';
import colors from '../../styles/colors';
import { moderateScale } from '../../styles/responsiveSize';

const RecentMessage = ({ item, userData, ...props }) => {
  const chatData = item?.chat
  let date = chatData?.createdAt;

  let data = chatData?.sender;;


  console.log("ITE<====", item);

  return (
    <View>
      <View style={styles.contactBox}>
        <Image
          source={{
            uri: data?.profilePicture || DUMMY_USER_URL,
          }}
          style={styles.newSessionBox1}
        />
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={props.onPress}
            style={{ width: '82%', paddingHorizontal: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text numberOfLines={2} style={styles.userName}>
                {item?.eventDetail?.name}
              </Text>

            </View>

            <Text numberOfLines={1}
              style={[styles.userName, styles.font400]}>
              <Text
                style={{
                  fontWeight: '400',
                  color: colors.otpPlaseHolder,
                }}>
                {data?.fullName}:{' '}
              </Text>

              <Text>{chatData?.message}</Text>
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center', marginBottom: 10 }}>
            <Text
              numberOfLines={2}
              style={[
                styles.optionTxt['false'],
                { fontSize: 12, textAlign: 'center' },
              ]}>
              {moment(date).format('DD MM YYYY') ==
                moment(new Date()).format('DD MM YYYY')
                ? moment(date).format('HH:mm')
                : moment(date).format('DD MMM')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(12),
    backgroundColor: '#fff'
  },
  contactBox: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: colors.white,
    marginHorizontal: 15,
  },
  helpIcon: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  noChat: {
    alignSelf: 'center',
    marginTop: 30,
  },
  button: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.red,
    height: 65,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    opacity: 0.87,
  },

  button3Text: {
    color: colors.white,
  },
  qaContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    marginTop: 4,
    // textTransform: 'capitalize'
  },
  newSessionBox1: {
    height: 45,
    width: 45,
    borderRadius: 35,
  },
  optionTxt: {
    true: {
      fontWeight: '700',
      color: colors.black,
      fontSize: 17,
    },
    false: {
      fontWeight: '700',
      color: colors.darkgrey,
      fontSize: 17,
    },
  },
  font400: {
    fontWeight: '400',
  }

})

export { RecentMessage };

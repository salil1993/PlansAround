import { View, Text, StatusBar, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import WrapperContainer from '../../Components/WrapperContainer'
import HeaderBack from '../../Components/HeaderBack'
import { height, moderateScale, scale } from '../../styles/responsiveSize'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { ListEmptyComponent } from '../../Components/ListEmptyComponent'
import { RecentMessage } from './RecentMessage'
import navigationStrings from '../../Navigation/navigationStrings'
import { getData } from '../../utils/helperFunctions'
import axios from 'axios'
import Loader from '../../Components/Loader'
import { useFocusEffect } from '@react-navigation/native'

const ChatDialog = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  // const [recentLoader, setLoadingState] = useState(true);
  const [recentList, setRecentList] = useState([]);
  const user = useSelector((state) => state.persistedReducer.authSlice.userData);

 

  useFocusEffect(
    React.useCallback(() => {
      getChatMessage()
    }, [])
  );


  const getChatMessage = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    let usertoken = await getData('UserToken');
    console.log(usertoken, 'token')
    const headers = {
      'Authorization': `Bearer ${usertoken}`,
      'Content-Type': "application/json",
    };
    let EndPoint = `https://plansaround-backend.vercel.app/api/mobile/message/`
    console.log('EndPoint', EndPoint)
    axios.get(EndPoint, { headers })
      .then((res) => {
        const responseData = res?.data;
        console.log('responseData', responseData)
        setIsLoading(false);
        setRecentList(responseData)
      }).
      catch((err) => {
        console.log(err)
        setIsLoading(false);
      })
  };




  const keyExtractorSession = (item, index) => `Key_${index}`;

  function renderItem({ item }) {
    return <RecentMessage
      onPress={() => {
        navigation.navigate(navigationStrings.MESSGAE_SCREEN, { item: item })

      }}
      item={item}
      userData={user}
    />;
  }

  return (
    <WrapperContainer>
      <StatusBar backgroundColor={'#fff'} />
      <View style={styles.container}>
        <HeaderBack mainText='All Messages' isLeftImage={true} />
        <FlatList
          data={recentList}
          renderItem={renderItem}
          keyExtractor={keyExtractorSession}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
      {isLoading && <Loader />}
    </WrapperContainer>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(12),
    backgroundColor: '#fff'
  },
  helpIcon: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  phoneHeading: {
    fontSize: scale(24),
    fontFamily: 'Roboto',
    fontWeight: '800',
    color: '#333'
  },
  phoneHeading2: {
    fontSize: scale(14),
    fontFamily: 'Roboto',
    fontWeight: '500',
    color: '#4F4F4F'
  },
  head1: {
    color: '#333',
    fontSize: scale(32),
    fontFamily: 'Roboto',
    fontWeight: '900'
  },
  head2: {
    color: '#4F4F4F',
    fontSize: scale(16),
    fontFamily: 'Roboto',
    fontWeight: '700'
  },
  modalStyle2: {
    backgroundColor: '#F2F2F2',
    minHeight: moderateScale(height / 4),
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
    padding: moderateScale(15)
  },
  hometxt: {
    color: '#333',
    fontSize: scale(22),
    fontFamily: 'Roboto',
    fontWeight: '800'
  },
  txt: {
    color: '#4F4F4F',
    fontFamily: 'Poppins',
    fontSize: scale(16),
    fontWeight: '700'
  }


});

export default ChatDialog
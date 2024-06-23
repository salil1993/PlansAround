import { View, Text, StatusBar, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import WrapperContainer from '../../Components/WrapperContainer'
import HeaderBack from '../../Components/HeaderBack'
import { height, moderateScale, scale } from '../../styles/responsiveSize'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch } from 'react-redux'
import { ListEmptyComponent } from '../../Components/ListEmptyComponent'
import { RecentMessage } from './RecentMessage'
import navigationStrings from '../../Navigation/navigationStrings'

const ChatDialog = ({navigation}) => {
  const dispatch = useDispatch();
  // const [recentLoader, setLoadingState] = useState(true);
  const [recentList, setRecentList] = useState([{
    createdAt: "2024-06-09T15:29:27.782Z",
    senderId: "wewi",
    from: {name: "munish"},
    to: {name: "salil"},
    content: "ennaskdjnasj",
  }]);

  const keyExtractorSession = (item, index) => `Key_${index}`;

  function renderItem({item}) {
    return <RecentMessage
     onPress={() => {
      navigation.navigate(navigationStrings.MESSGAE_SCREEN)

    }} item={item} />;
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
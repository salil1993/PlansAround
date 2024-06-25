import { useEffect, useRef, useState } from "react";
import { getData } from "../../utils/helperFunctions";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageApi } from "../../API/Api";
import { LogBox } from "react-native";
import { useRoute } from "@react-navigation/native";

const useMessage = () => {
  const User = useSelector((state) => state.persistedReducer.authSlice.userData);
  const route = useRoute()

  const [paginationLoader, setPageLoader] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [roomMessageList, setRoomMessageList] = useState([])
  const flatListRef = useRef(null);
  const [msg, setMsg] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getChats(1)
  }, []);

  console.log("route=www=",);

  const getChats = async (pageNumber) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    let usertoken = await getData('UserToken');
    console.log(usertoken, 'token')
    const headers = {
      'Authorization': `Bearer ${usertoken}`,
      // 'Content-Type': "application/json",
    };
    let EndPoint = `https://plansaround-backend.vercel.app/api/mobile/message/${route?.params?.item?.eventDetail?._id}?page=${pageNumber}&limit=10`
    console.log('EndPoint', EndPoint)
    axios.get(EndPoint, { headers })
      .then((res) => {
        const responseData = res?.data?.messages?.docs;
        // setRoomMessageList(responseData)
        setRoomMessageList((prevEvents) => {
          if (pageNumber === 1) {
              // If it's the first page, replace existing events
              return responseData;
          } else {
              // If it's not the first page, append new events to the existing list
              return [...prevEvents, ...responseData];
          }
      });
      setPage(pageNumber);
      console.log('responseData', JSON.stringify(responseData))
      setIsLoading(false);
      setHasMore(responseData?.length > 0); 
      }).
      catch((err) => {
        console.log(err.response.data.message)
        setIsLoading(false);
      })
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      getChats(page + 1);
    }
};
  const onSend = () => {
    const message = msg
    setMsg("")
    sendMessageApi(route?.params?.item?.eventDetail?._id, message)
      .then(res => {
        const data = {
          ...res?.data,
          "sender": {
            "_id": User?._id,
            "profilePicture": User?.profilePicture
          }
        }
        setRoomMessageList([data,...roomMessageList])
  
      }).catch(err => {
        console.log("err===", err);
      })
  }

  return {
    paginationLoader,
    roomMessageList,
    handleLoadMore,
    flatListRef,
    msg,
    setMsg,
    onSend,
    isLoading,
    hasMore
  };
};

export default useMessage;
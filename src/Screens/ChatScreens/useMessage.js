import { useEffect, useRef, useState } from "react";
import { getData } from "../../utils/helperFunctions";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageApi } from "../../API/Api";
import { LogBox } from "react-native";

const useMessage = () => {
  const User = useSelector((state) => state.persistedReducer.authSlice.userData);
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

  const getChats = async (pageNumber) => {
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
    let EndPoint = `https://plansaround-backend.vercel.app/api/mobile/message/665df61915a633e11adaf987?page=${pageNumber}&limit=10`
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
    sendMessageApi("665df61915a633e11adaf987", message)
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
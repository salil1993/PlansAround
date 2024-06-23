import { useEffect, useRef, useState } from "react";

const useMessage = () => {
  const [paginationLoader, setPageLoader] = useState(false)
  const [roomMessageList, setRoomMessageList] = useState([
    {
      senderId: "12",
      content: "asjndkjnsadjsd",
      createdAt: "2024-06-09T15:29:27.782Z",
    },
    {
      senderId: "13",
      content: "asjndkjnsadjsd",
      createdAt: "2024-06-09T15:29:27.782Z",
    },
  ])
  const flatListRef = useRef(null);
  const [msg, setMsg] = useState('');
  const profileData = {id: "13"}

  useEffect(() => {

  }, []);

  const loadMoreRandomData = () => {
    // some logic here
  };
  const onSend = () => {

  }

  return {
    paginationLoader,
    roomMessageList,
    loadMoreRandomData,
    flatListRef,
    msg,
    setMsg,
    onSend,
    profileData
  };
};

export default useMessage;
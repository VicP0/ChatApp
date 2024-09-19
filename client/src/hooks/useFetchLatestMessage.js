import { useState, useEffect, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { getRequest, baseUrl } from "../utils/services";

export const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const { latesMessage, setLatesMessage } = useState(null);

  useEffect(() => {
    const getMessage = async () => {
      const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

      if (response.error) {
        return console.log("Error getting messages...", error);
      }

      const lastMessage = response[response?.length - 1];

      setLatesMessage(lastMessage);
    };

    getMessage();
  }, [newMessage, notifications]);
  return { latesMessage };
};

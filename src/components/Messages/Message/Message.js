import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

import "./Message.css";

import ReactEmoji from "react-emoji";

const Message = ({ message: { text, user }, name }) => {
  const [member, setMember] = useState("");
  const [isSentByCurrentUser, setIsSentByCurrentUser] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "/profile/" + sessionStorage.getItem("userId")
      );

      setMember(response.data.member);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (user === /*trimmedName*/ member.userName) {
      setIsSentByCurrentUser(true);
    }
  }, [member]);
  //const trimmedName = name.trim().toLowerCase();

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{/*trimmedName*/ member.userName}</p>
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );
};

export default Message;

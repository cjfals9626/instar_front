import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import Modal from "react-modal";
import Messages from "./Messages/Messages";
import InfoBar from "./InfoBar/InfoBar";
import Input from "./Input/Input";
import EachChatRoom from "./EachChatRoom";
import NewMessageRoomOpen from "./NewMessageRoomOpen";

import "../css/DirectMessage.css";

const ENDPOINT = "http://localhost:8080";
let socket;

const ChatField = (props) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [firstRender, setFirstRender] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await axios
        .get("/profile/" + sessionStorage.getItem("userId"))
        .then((res) => {
          setName(res.data.member.userName);
          setFirstRender(true);
        });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (firstRender) {
      if (socket === undefined) {
        socket = io(ENDPOINT);
        let room = props.selectRoomName;
        socket.emit("join", { name, room }, (error) => {
          if (error) {
            alert(error);
          }
        });
      } else {
        socket.disconnect();
        setMessages((messages) => []);
        socket = io(ENDPOINT);

        let room = props.selectRoomName;
        socket.emit("join", { name, room }, (error) => {
          if (error) {
            alert(error);
          }
        });
      }
    }
  }, [ENDPOINT, props.selectRoomName, firstRender]);

  useEffect(() => {
    if (firstRender) {
      socket.on("message", (message) => {
        setMessages((messages) => [...messages, message]);
      });

      socket.on("roomData", ({ users }) => {
        setUsers(users);
      });
    }
  }, [firstRender, props.selectRoomName]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  const onClickDeleteChatRoom = async () => {
    async function deleteChatRoom() {
      console.log(props.selectRoomName);
      await axios
        .post("/deleteChatRoom", { roomName: props.selectRoomName })
        .then((res) => {
          props.setSelectRoomName("");
          socket.disconnect();
          setMessages((messages) => []);
        });
    }
    deleteChatRoom();
  };

  return (
    <div className="chating_field">
      <div className="chatRoom_name">
        {props.selectRoomName}

        <div class="deleteChatRoom" onClick={onClickDeleteChatRoom}>
          <svg
            aria-label="Close"
            class="_ab6-"
            color="#262626"
            fill="#262626"
            height="18"
            role="img"
            viewBox="0 0 24 24"
            width="18"
          >
            <polyline
              fill="none"
              points="20.643 3.357 12 12 3.353 20.647"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
            ></polyline>
            <line
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              x1="20.649"
              x2="3.354"
              y1="20.649"
              y2="3.354"
            ></line>
          </svg>
        </div>
      </div>
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatField;

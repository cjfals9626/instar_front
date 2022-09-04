import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import axios from "axios";
import Modal from "react-modal";
import Messages from "./Messages/Messages";
import InfoBar from "./InfoBar/InfoBar";
import Input from "./Input/Input";
import EachChatRoom from "./EachChatRoom";
import NewMessageRoomOpen from "./NewMessageRoomOpen";
import ChatField from "./ChatField";

import "../css/DirectMessage.css";

const DirectMessage = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [chatRooms, setChatRooms] = useState([]);
  const [selectRoomName, setSelectRoomName] = useState("");
  const [newMessageModal, setNewMessageModal] = useState(false);
  const [user, setUser] = useState("");
  const [firstRender, setFirstRender] = useState(false);

  function openNewMessageModal() {
    setNewMessageModal(true);
  }
  function closeNewMessageModal() {
    setNewMessageModal(false);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  // useEffect(() => {
  //   //const { name, room } = queryString.parse(window.location.search);

  //   socket = io(ENDPOINT);

  //   const name = "cjfals5626";
  //   const room = "cjfals";
  //   setRoom(room);
  //   setName(name);

  //   socket.emit("join", { name, room }, (error) => {
  //     if (error) {
  //       alert(error);
  //     }
  //   });
  // }, [ENDPOINT, window.location.search]);

  // useEffect(() => {
  //   socket.on("message", (message) => {
  //     setMessages((messages) => [...messages, message]);
  //   });

  //   socket.on("roomData", ({ users }) => {
  //     setUsers(users);
  //   });
  // }, []);

  // const sendMessage = (event) => {
  //   event.preventDefault();

  //   if (message) {
  //     socket.emit("sendMessage", message, () => setMessage(""));
  //   }
  // };
  useEffect(() => {
    async function fetchData() {
      await axios
        .get("/profile/" + sessionStorage.getItem("userId"))
        .then((res) => {
          setUser(res.data.member);
          setName(res.data.member.userName);
          setFirstRender(true);
        });
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "/chatRooms/" + sessionStorage.getItem("userId")
      );

      setChatRooms(response.data.chatRooms);
    }
    fetchData();
  }, [selectRoomName]);
  const changeRoom = (roomName) => {
    setSelectRoomName(roomName);
  };

  return (
    <div className="outerContainer">
      <div className="dm_container">
        <div className="chatRooms">
          <div className="chat_userName">
            {user.userName}
            <div class="select_members" onClick={openNewMessageModal}>
              <svg
                aria-label="New message"
                class="_ab6-"
                color="#262626"
                fill="#262626"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <path
                  d="M12.202 3.203H5.25a3 3 0 00-3 3V18.75a3 3 0 003 3h12.547a3 3 0 003-3v-6.952"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
                <path
                  d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 012.004 0l1.224 1.225a1.417 1.417 0 010 2.004z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
                <line
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  x1="16.848"
                  x2="20.076"
                  y1="3.924"
                  y2="7.153"
                ></line>
              </svg>
            </div>
            <Modal
              isOpen={newMessageModal}
              onRequestClose={closeNewMessageModal}
              style={customStyles}
              ariaHideApp={false}
            >
              <NewMessageRoomOpen closeNewMessageModal={closeNewMessageModal} />
            </Modal>
          </div>
          <div className="my_rooms">
            {chatRooms
              ? chatRooms.map((chatRoom, id) => {
                  return (
                    <EachChatRoom
                      key={id}
                      chatRoom={chatRoom}
                      changeRoom={changeRoom}
                    />
                  );
                })
              : null}
          </div>
        </div>
        {selectRoomName === "" ? (
          <div className="initialScreen">
            <div className="text">Your Messages</div>
            <div className="text">
              Send private photos and messages to a friend or group.
            </div>
            <div className="newChatRoom_button">
              <div className="button_text" onClick={openNewMessageModal}>
                send Message
              </div>
            </div>
          </div>
        ) : (
          <ChatField
            selectRoomName={selectRoomName}
            setSelectRoomName={setSelectRoomName}
          />
        )}
      </div>
    </div>
  );
};

export default DirectMessage;

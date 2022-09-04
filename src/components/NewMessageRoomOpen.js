import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "../css/NewMessageRoomOpen.css";
import NewChatRoomEachMember from "./NewChatRoomEachMember";

export default function NewMessageRoomOpen(props) {
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [followingUsers, setFollowingUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const submitRef = useRef(null);

  const onChangeSearch = useCallback((e) => {
    setSearchKeyWord(e.target.value);
  }, []);
  useEffect(() => {
    async function fetchData() {
      if (searchKeyWord === "") {
        const response = await axios.get(
          "/followingCount/" + sessionStorage.getItem("userId")
        );
        setFollowingUsers(response.data.followingMembers);
      } else {
        const response = await axios.post(
          "/findUsers/" + sessionStorage.getItem("userId") + "/" + searchKeyWord
        );
        setSearchUsers(response.data.member);
      }
    }
    fetchData();
  }, [searchKeyWord, followingUsers]);
  const onClickCancelSelect = (id) => {
    setSelectedMembers(selectedMembers.filter((_, index) => index !== id));
  };
  useEffect(() => {
    if (selectedMembers.length === 0) {
      submitRef.current.style.color = "#b3dbff";
      submitRef.current.style.pointerEvents = "none";
      submitRef.current.style.cursor = "none";
    } else {
      submitRef.current.style.color = "#0095f6";
      submitRef.current.style.pointerEvents = "auto";
      submitRef.current.style.cursor = "pointer";
    }
  }, [selectedMembers]);

  const onSubmit = async (e) => {
    async function newChatRoomSubmit() {
      await axios
        .post("/newChatRoomOpen/" + sessionStorage.getItem("userId"), {
          members: selectedMembers,
        })
        .then((res) => {
          window.location.reload();
          console.log(res);
        });
    }
    newChatRoomSubmit();
  };

  return (
    <div className="newMessageModal">
      <div className="header">
        <div class="closeNewMessageModal" onClick={props.closeNewMessageModal}>
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
        <div className="title">New message</div>
        <div
          className="submit_chatRoom_members"
          ref={submitRef}
          onClick={onSubmit}
        >
          Next
        </div>
      </div>
      <div className="chatRoom_members">
        <div className="to">To:</div>
        <div className="search_members">
          {selectedMembers.map((user, id) => {
            return (
              <div className="selected_members">
                <div className="each_memberName">
                  {user.userName}
                  <div
                    class="cancel_select"
                    onClick={() => onClickCancelSelect(id)}
                  >
                    <svg
                      aria-label="Delete Item"
                      class="_ab6-"
                      color="#0095f6"
                      fill="#0095f6"
                      height="12"
                      role="img"
                      viewBox="0 0 24 24"
                      width="12"
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
              </div>
            );
          })}

          <input
            className="search_member_input"
            placeholder="Search..."
            onChange={onChangeSearch}
            value={searchKeyWord}
          ></input>
        </div>
      </div>
      <div className="sub_members">
        {searchKeyWord === "" ? (
          <div className="suggested_member">Suggested</div>
        ) : null}
        {searchKeyWord === ""
          ? followingUsers.map((user, id) => {
              return (
                <NewChatRoomEachMember
                  key={id}
                  index={id}
                  user={user}
                  setSelectedMembers={setSelectedMembers}
                  selectedMembers={selectedMembers}
                  setSearchKeyWord={setSearchKeyWord}
                />
              );
            })
          : searchUsers.map((user, id) => {
              return (
                <NewChatRoomEachMember
                  key={id}
                  index={id}
                  user={user}
                  setSelectedMembers={setSelectedMembers}
                  selectedMembers={selectedMembers}
                  setSearchKeyWord={setSearchKeyWord}
                />
              );
            })}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "../css/SearchMember.css";

export default function SearchMember(props) {
  const onClick = async () => {
    try {
      axios.post(
        "/registSearchUser/" + sessionStorage.getItem("userId"),
        {
          searchUserId: props.user._id,
        },
        { withCredentials: true }
      );
    } catch (err) {
      if (err.response.status === 401) {
      }
    }
  };
  const onClickSearchRecordEachClear = async () => {
    await axios.post("/searchRecordEachClear", {
      userId: props.user._id,
    });
    props.setSearchedUsers([]);
  };
  return (
    <div className="search_each_row">
      <Link
        to={"/profile/posts/" + props.user._id}
        className="earch_member_profile"
        id={props.isRecord === undefined ? "earch_member_profile" : null}
        onClick={props.isRecord === undefined ? onClick : null}
      >
        <div className="profile_img">
          <img src={props.user.profileImg}></img>
        </div>
        <div className="text_content">
          <div className="user_name">{props.user.userName}</div>
          <div className="user_fullname">{props.user.fullName}</div>
        </div>
      </Link>
      {props.isRecord ? (
        <div className="each_clear" onClick={onClickSearchRecordEachClear}>
          <svg
            aria-label="Close"
            className="_ab6-"
            color="#8e8e8e"
            fill="#8e8e8e"
            height="16"
            role="img"
            viewBox="0 0 24 24"
            width="16"
          >
            <polyline
              fill="none"
              points="20.643 3.357 12 12 3.353 20.647"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            ></polyline>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              x1="20.649"
              x2="3.354"
              y1="20.649"
              y2="3.354"
            ></line>
          </svg>
        </div>
      ) : null}
    </div>
  );
}

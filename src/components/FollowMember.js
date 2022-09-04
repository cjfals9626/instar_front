import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "../css/SearchMember.css";

export default function SearchMember(props) {
  return (
    <div className="search_each_row">
      <Link
        to={"/profile/posts/" + props.user._id}
        className="earch_member_profile"
      >
        <div className="profile_img">
          <img src={props.user.profileImg}></img>
        </div>
        <div className="text_content">
          <div className="user_name">{props.user.userName}</div>
          <div className="user_fullname">{props.user.fullName}</div>
        </div>
      </Link>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProfilePostEach from "./ProfilePostEach";
import ProfilePostEmpty from "./ProfilePostEmpty";
import "../css/ProfilePost.css";

export default function ProfileSaved() {
  const [posts, setPosts] = useState([]);
  const [emptySlot, setEmptySlot] = useState([]);

  const simplePathName = useLocation().pathname;
  const splitPath = simplePathName.split("/");
  const lastPath = splitPath[splitPath.length - 1];

  useEffect(() => {
    async function fetchData() {
      await axios.get("/getBookMarkPosts/" + lastPath).then((res) => {
        setPosts(res.data.postSetArray);
      });
    }
    fetchData();
  }, [lastPath]);

  useEffect(() => {
    if (posts.length % 3 !== 0) {
      for (let i = 0; i < 3 - (posts.length % 3); i++) {
        setEmptySlot((emptySlot) => [...emptySlot, 0]);
      }
    }
  }, [posts]);

  return (
    <div className="profile_posts">
      <div className="posts_contain">
        {posts.map((post, id) => {
          return <ProfilePostEach key={id} postContent={post} />;
        })}
        {emptySlot.map((post, id) => {
          return <ProfilePostEmpty />;
        })}
      </div>
    </div>
  );
}

import "../css/Home.css";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Post from "./Post";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "/getAllPosts/" + sessionStorage.getItem("userId")
      );
      setPosts(response.data.postSetArray);
    }
    fetchData();
  }, []);

  return (
    <div className="home_contain">
      <div className="post_field">
        {posts.map((post, id) => {
          return <Post key={id} postContent={post} />;
        })}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import Modal from "react-modal";
import axios from "axios";
import PostModal from "./PostModal";

export default function ProfilePostEach(props) {
  const [post_modalOpen, setPostModalOpen] = useState(false);
  const [post_bookmark, setPostBookMark] = useState(false);
  const [post_like, setPostLike] = useState(false);
  const [firstRender, setFirstRender] = useState(false);

  function openPostModal() {
    setPostModalOpen(true);
  }
  function closePostModal() {
    setPostModalOpen(false);
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
  const onClickPostLike = (e) => {
    setPostLike((current) => !current);
  };
  useEffect(() => {
    async function fetchData() {
      const responsePostLike = await axios.get(
        "/posts/" +
          props.postContent.postId +
          "/getPostLike/" +
          sessionStorage.getItem("userId")
      );
      if (responsePostLike.data.postLike.length !== 0) {
        setPostLike(true);
      }
      const responseBookMark = await axios.get(
        "/posts/" +
          props.postContent.postId +
          "/getBookMark/" +
          sessionStorage.getItem("userId")
      );
      if (responseBookMark.data.bookMark.length !== 0) {
        setPostBookMark(true);
      }
    }

    fetchData();
    setFirstRender(true);
  }, []);

  useEffect(() => {
    if (firstRender) {
      if (post_like === true) {
        axios.post(
          "/posts/" +
            props.postContent.postId +
            "/registPostLike/" +
            sessionStorage.getItem("userId")
        );
      } else {
        axios.post(
          "/posts/" +
            props.postContent.postId +
            "/removePostLike/" +
            sessionStorage.getItem("userId")
        );
      }
    }
  }, [post_like]);

  const onClickBookMark = (e) => {
    setPostBookMark((current) => !current);
  };

  useEffect(() => {
    if (firstRender) {
      if (post_bookmark === true) {
        axios.post(
          "/posts/" +
            props.postContent.postId +
            "/registBookMark/" +
            sessionStorage.getItem("userId")
        );
      } else {
        axios.post(
          "/posts/" +
            props.postContent.postId +
            "/removeBookMark/" +
            sessionStorage.getItem("userId")
        );
      }
    }
  }, [post_bookmark]);

  return (
    <>
      <div className="each_posts">
        {props.postContent.media[0].mediaContent.includes(
          ".mp4" ||
            ".m4v" ||
            ".avi" ||
            ".wmv" ||
            ".mpg" ||
            ".mpeg" ||
            ".mov" ||
            ".webm"
        ) ? (
          <video
            className="post_preview"
            src={props.postContent.media[0].mediaContent}
            onClick={openPostModal}
            controls={false}
            muted
          />
        ) : (
          <img
            className="post_preview"
            src={props.postContent.media[0].mediaContent}
            onClick={openPostModal}
          ></img>
        )}
      </div>
      <Modal
        isOpen={post_modalOpen}
        onRequestClose={closePostModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <PostModal
          postContent={props.postContent}
          postLike={post_like}
          onClickPostLike={onClickPostLike}
          postBookMark={post_bookmark}
          onClickBookMark={onClickBookMark}
          postModalOpen={post_modalOpen}
        />
      </Modal>
    </>
  );
}

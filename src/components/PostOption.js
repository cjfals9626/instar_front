import React, { useState, useEffect, useRef, useCallback } from "react";
import "../css/PostOption.css";
import axios from "axios";
import Modal from "react-modal";
import EditPost from "./EditPost";

export default function PostOption(props) {
  const [editPostOpen, setEditPostOpen] = useState(false);

  const onDelete = async () => {
    try {
      await axios.post("/posts/removePost/" + props.postId);
    } catch (err) {
      console.log(err);
    }
    //새로고침
    window.location.reload();
  };
  function openEditPost() {
    setEditPostOpen(true);
  }
  function closeEditPost() {
    setEditPostOpen(false);
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
  return (
    <div className="options">
      <button className="post_delete" onClick={onDelete}>
        Delete
      </button>
      <button className="post_edit" onClick={openEditPost}>
        Edit
      </button>
      <Modal
        isOpen={editPostOpen}
        onRequestClose={closeEditPost}
        style={customStyles}
        ariaHideApp={false}
      >
        <EditPost postId={props.postId} />
      </Modal>
      <button className="post_hide_like">Hide like count</button>
      <button className="post_not_comment">Turn off commenting</button>
      <button className="go_to_post">Go to post</button>
      <button className="cancel">Cancle</button>
    </div>
  );
}

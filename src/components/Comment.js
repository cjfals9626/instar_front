import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "../css/Comment.css";

export default function Comment(props) {
  const [comment_like, setCommentLike] = useState(false);
  const [firstRender, setFirstRender] = useState(false);
  const commentLikeRef = useRef(null);
  const [replys, setReplys] = useState([]);
  const replyRef = useRef(null);
  const [isViewingReply, setIsViewingReply] = useState(false);

  const onClickCommentLike = (e) => {
    setCommentLike((current) => !current);
  };
  useEffect(() => {
    async function fetchData() {
      const responsePostLike = await axios.get(
        "/comments/" +
          props.commentContent.comment._id +
          "/getCommentLike/" +
          sessionStorage.getItem("userId")
      );
      if (responsePostLike.data.commentLike.length !== 0) {
        setCommentLike(true);
      } else {
        setCommentLike(false);
      }
    }
    fetchData();
    setFirstRender(true);
    replyRef.current.style.display = "none";
  }, [props.postModalOpen]);
  useEffect(() => {
    if (firstRender) {
      if (comment_like === true) {
        commentLikeRef.current.classList.add("liked");

        axios.post(
          "/comments/" +
            props.commentContent.comment._id +
            "/registCommentLike/" +
            sessionStorage.getItem("userId")
        );
      } else {
        commentLikeRef.current.classList.remove("liked");

        axios.post(
          "/comments/" +
            props.commentContent.comment._id +
            "/removeCommentLike/" +
            sessionStorage.getItem("userId")
        );
      }
    }
  }, [comment_like]);
  const onClickReply = () => {
    props.setReply(true);
    props.setCommentValue("@" + props.commentContent.writer.userName + " ");
    props.setReplyCommentId(props.commentContent.comment._id);
  };
  const onClickViewReply = () => {
    replyRef.current.style.display = "block";
    setIsViewingReply(true);
  };
  const onClickHideReply = () => {
    replyRef.current.style.display = "none";
    setIsViewingReply(false);
  };
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "/getReply/" + props.commentContent.comment._id
      );
      setReplys(response.data.commentSetArray);
      props.setIsSubmitForReply(false);
    }
    fetchData();
  }, [props.isSubmitForReply]);
  return (
    <div className="each_comment">
      <div className="top_comment">
        <div className="writer_profile">
          {props.isModal ? (
            <img src={props.commentContent.writer.profileImg}></img>
          ) : null}
        </div>
        <div className="writer">
          {props.commentContent.writer.userName}
          {props.isModal ? <div className="comment_date">1 w</div> : null}
        </div>
        <div className="writing_content">
          {props.commentContent.comment.contents}
          {props.isModal ? (
            <div className="comment_reply" onClick={onClickReply}>
              Reply
            </div>
          ) : null}
        </div>
        <div className="comment_like">
          <svg
            className="like"
            color="black"
            fill="white"
            height="12"
            viewBox="0 0 48 48"
            width="14"
            ref={commentLikeRef}
            onClick={onClickCommentLike}
          >
            <path
              className="heart  "
              d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
              stroke="currentColor"
              strokeWidth="3"
            ></path>
          </svg>
        </div>
      </div>
      {replys.length === 0 ? null : isViewingReply ? (
        <div className="hide_replies" onClick={onClickHideReply}>
          ----- Hide replies({replys.length})
        </div>
      ) : (
        <div className="view_replies" onClick={onClickViewReply}>
          ----- View replies({replys.length})
        </div>
      )}

      <div className="comments" ref={replyRef}>
        {replys.map((comment, id) => {
          return (
            <Comment
              key={id}
              commentContent={comment}
              isModal={true}
              onClickCommentLike={props.onClickCommentLike}
              postModalOpen={props.postModalOpen}
              setReply={props.setReply}
              setCommentValue={props.setCommentValue}
              setReplyCommentId={props.setReplyCommentId}
              isSubmitForReply={props.isSubmitForReply}
              setIsSubmitForReply={props.setIsSubmitForReply}
            />
          );
        })}
      </div>
    </div>
  );
}

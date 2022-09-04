import Modal from "react-modal";
import axios from "axios";
import "../css/PostModal.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ImgContent from "./ImgContent";
import Carousel from "react-material-ui-carousel";
import Slider from "react-slick";
import Comment from "./Comment";
import PostOption from "./PostOption";
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
const onClickCommentLike = (e) => {
  e.target.classList.toggle("liked");
};

export default function PostModal(props) {
  const [comments, setComments] = useState([]);

  const [comment_value, setCommentValue] = useState("");
  const post_modal_like = useRef(null);
  const post_modal_bookmark = useRef(null);
  const commentPostButtonModal = useRef(null);
  const [post_option_modalOpen, setPostOptionOpen] = useState(false);
  const [reply, setReply] = useState(false);
  const [replyCommentId, setReplyCommentId] = useState("");
  const [isSubmitForReply, setIsSubmitForReply] = useState(false);
  function openPostOption() {
    setPostOptionOpen(true);
  }
  function closePostOption() {
    setPostOptionOpen(false);
  }
  const onChangeComment = useCallback((e) => {
    setCommentValue(e.target.value);

    if (e.target.value === "") {
      commentPostButtonModal.current.setAttribute("disabled", "disabled");
      commentPostButtonModal.current.removeAttribute("id");
    } else {
      commentPostButtonModal.current.removeAttribute("disabled");
      commentPostButtonModal.current.setAttribute(
        "id",
        "comment_button_activity"
      );
    }
  }, []);
  const onSubmitComment = async (e) => {
    try {
      e.preventDefault();
      if (reply) {
        axios.post("/posts/registReply/" + sessionStorage.getItem("userId"), {
          commentId: replyCommentId,
          commentContent: comment_value,
        });
        setReply(false);
      } else {
        axios.post("/posts/registComment/" + sessionStorage.getItem("userId"), {
          postId: props.postContent.postId,
          commentContent: comment_value,
        });
      }

      setCommentValue("");
      async function fetchData() {
        const response = await axios.get("/getComment/" + postId);
        setComments(response.data.commentSetArray);
      }
      fetchData();
      setIsSubmitForReply(true);
    } catch (err) {
      if (err.response.status === 401) {
      }
    }
  };

  const onEnterKeyDown = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      commentPostButtonModal.current.click();
    }
  };

  useEffect(() => {
    if (props.postLike === true) {
      post_modal_like.current.classList.add("liked");
    } else {
      post_modal_like.current.classList.remove("liked");
    }
  }, [props.postLike]);

  useEffect(() => {
    if (props.postBookMark === true) {
      post_modal_bookmark.current.classList.add("bookMarked");
    } else {
      post_modal_bookmark.current.classList.remove("bookMarked");
    }
  }, [props.postBookMark]);

  const postId = props.postContent.postId;
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("/getComment/" + postId);
      setComments(response.data.commentSetArray);
    }
    fetchData();
  }, []);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  return (
    <div className="post_modal">
      <div className="modal_left">
        <div className="media_field">
          {/* <Carousel
            autoPlay={false}
            navButtonsAlwaysVisible={true}
            animation={"slide"}
            cycleNavigation={false}
          >
            {props.postContent.media.map((mediaSrc, id) => {
              return <ImgContent key={id} imgsrc={mediaSrc.mediaContent} />;
            })}
          </Carousel> */}
          <Slider {...settings}>
            {props.postContent.media.map((mediaSrc, id) => {
              return <ImgContent key={id} imgsrc={mediaSrc.mediaContent} />;
            })}
          </Slider>
        </div>
      </div>

      <div className="modal_right">
        <div className="post_header">
          <div className="profile">
            <div className="post_header_profile_img">
              <a className="profileImg">
                <img src={props.postContent.writer.profileImg}></img>
              </a>
            </div>
            <div className="userName">
              <a className="name_text">{props.postContent.writer.userName}</a>
            </div>
          </div>
          <div className="option_field">
            <svg className="option" onClick={openPostOption}>
              <circle cx="12" cy="12" r="1.5"></circle>
              <circle cx="6" cy="12" r="1.5"></circle>
              <circle cx="18" cy="12" r="1.5"></circle>
            </svg>
            <Modal
              isOpen={post_option_modalOpen}
              onRequestClose={closePostOption}
              style={customStyles}
              ariaHideApp={false}
            >
              <PostOption postId={props.postContent.postId} />
            </Modal>
          </div>
        </div>

        <div className="text_content">
          <div className="post_header_profile_img">
            <a className="profileImg">
              <img src={props.postContent.writer.profileImg}></img>
            </a>
          </div>
          <div className="writer">{props.postContent.writer.userName}</div>
          <div className="writing_content">{props.postContent.textContent}</div>
        </div>
        <div className="comments">
          {comments.map((comment, id) => {
            return (
              <Comment
                key={id}
                commentContent={comment}
                isModal={true}
                onClickCommentLike={onClickCommentLike}
                postModalOpen={props.postModalOpen}
                setReply={setReply}
                setCommentValue={setCommentValue}
                setReplyCommentId={setReplyCommentId}
                isSubmitForReply={isSubmitForReply}
                setIsSubmitForReply={setIsSubmitForReply}
              />
            );
          })}
        </div>
        <div className="media_content">
          <div className="media_add_task">
            <svg
              className="like"
              color="black"
              fill="white"
              height="12"
              viewBox="0 0 48 48"
              width="14"
              onClick={props.onClickPostLike}
              ref={post_modal_like}
            >
              <path
                className="heart  "
                d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
                stroke="currentColor"
                strokeWidth="3"
              ></path>
            </svg>
            <svg className="comment">
              <path
                d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z"
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            <svg className="dm">
              <line
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="22"
                x2="9.218"
                y1="3"
                y2="10.083"
              ></line>
              <polygon
                fill="none"
                points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
              ></polygon>
            </svg>

            <svg
              className="bookMark"
              fill="none"
              onClick={props.onClickBookMark}
              ref={post_modal_bookmark}
            >
              <polygon
                className="bookMark_icon  "
                points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></polygon>
            </svg>
          </div>
        </div>
        {/* <div className="creation_day">
          <span className="day">1 DAYS AGO</span>
        </div> */}
        <div className="comment_input_field">
          <form className="comment_input_form" onSubmit={onSubmitComment}>
            <textarea
              className="comment_input"
              placeholder="Add a comment..."
              value={comment_value}
              onChange={onChangeComment}
              onKeyDown={onEnterKeyDown}
            ></textarea>
            <button
              className="comment_post_button"
              disabled="disabled"
              type="submit"
              ref={commentPostButtonModal}
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

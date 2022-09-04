import "../css/Post.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Modal from "react-modal";
import ImgContent from "./ImgContent";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Comment from "./Comment";
import PostModal from "./PostModal";
import PostOption from "./PostOption";

export default function Post(props) {
  const [comments, setComments] = useState([]);

  const [comment_value, setCommentValue] = useState("");
  const [post_modalOpen, setPostModalOpen] = useState(false);
  const [post_like, setPostLike] = useState(false);
  const [post_bookmark, setPostBookMark] = useState(false);
  const postLikeRef = useRef(null);
  const postBookMarkRef = useRef(null);
  const commentPostButton = useRef(null);
  const textContentFrontPart = useRef(null);
  const textContentAllView = useRef(null);
  const [firstRender, setFirstRender] = useState(false);

  const [post_option_modalOpen, setPostOptionOpen] = useState(false);

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
        postLikeRef.current.classList.add("liked");

        axios.post(
          "/posts/" +
            props.postContent.postId +
            "/registPostLike/" +
            sessionStorage.getItem("userId")
        );
      } else {
        postLikeRef.current.classList.remove("liked");

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
        postBookMarkRef.current.classList.add("bookMarked");

        axios.post(
          "/posts/" +
            props.postContent.postId +
            "/registBookMark/" +
            sessionStorage.getItem("userId")
        );
      } else {
        postBookMarkRef.current.classList.remove("bookMarked");

        axios.post(
          "/posts/" +
            props.postContent.postId +
            "/removeBookMark/" +
            sessionStorage.getItem("userId")
        );
      }
    }
  }, [post_bookmark]);

  var text_content_front = props.postContent.textContent.split(/\r\n|\r|\n/);

  function openPostModal() {
    setPostModalOpen(true);
  }
  function closePostModal() {
    setPostModalOpen(false);
  }
  function openPostOption() {
    setPostOptionOpen(true);
  }
  function closePostOption() {
    setPostOptionOpen(false);
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

  const onChangeComment = useCallback((e) => {
    setCommentValue(e.target.value);

    if (e.target.value === "") {
      commentPostButton.current.setAttribute("disabled", "disabled");
      commentPostButton.current.removeAttribute("id");
    } else {
      commentPostButton.current.removeAttribute("disabled");
      commentPostButton.current.setAttribute("id", "comment_button_activity");
    }
  }, []);

  const onEnterKeyDown = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      commentPostButton.current.click();
    }
  };

  const onClickTextContentAllView = (e) => {
    textContentAllView.current.style.display = "block";
    textContentFrontPart.current.style.display = "none";
  };

  const onSubmitComment = async (e) => {
    try {
      e.preventDefault();
      axios.post("/posts/registComment/" + sessionStorage.getItem("userId"), {
        postId: props.postContent.postId,
        commentContent: comment_value,
      });
      setCommentValue("");

      async function fetchData() {
        const response = await axios.get("/getComment/" + postId);
        setComments(response.data.commentSetArray);
      }
      fetchData();
    } catch (err) {
      if (err.response.status === 401) {
      }
    }
  };
  const postId = props.postContent.postId;
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("/getComment/" + postId);
      setComments(response.data.commentSetArray);
    }
    fetchData();
  }, []);

  let commentFrontViewCount = comments.length - 3;

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  return (
    <>
      <div className="post">
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
        <div className="media_content">
          <Slider {...settings}>
            {props.postContent.media.map((mediaSrc, id) => {
              return <ImgContent key={id} imgsrc={mediaSrc.mediaContent} />;
            })}
          </Slider>
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

          <div className="media_add_task">
            <svg
              className="like"
              color="black"
              fill="white"
              height="12"
              viewBox="0 0 48 48"
              width="14"
              onClick={onClickPostLike}
              ref={postLikeRef}
            >
              <path
                className="heart  "
                d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
                stroke="currentColor"
                strokeWidth="3"
              ></path>
            </svg>
            <svg className="comment" onClick={openPostModal}>
              <path
                d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z"
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
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
              onClick={onClickBookMark}
              ref={postBookMarkRef}
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
        <div className="text_content">
          <div className="writer">{props.postContent.writer.userName}</div>
          {text_content_front.length != 1 ? (
            <>
              <div className="writing_content_front" ref={textContentFrontPart}>
                {text_content_front[0] + "..."}
                <span
                  className="more_text_content"
                  onClick={onClickTextContentAllView}
                >
                  more
                </span>
              </div>
              <div className="writing_content_all" ref={textContentAllView}>
                {props.postContent.textContent}
              </div>
            </>
          ) : (
            <div className="writing_content">
              {props.postContent.textContent}
            </div>
          )}
        </div>
        <div className="comment_count" onClick={openPostModal}>
          {comments.length > 2 ? (
            <a>View all {comments.length} comments</a>
          ) : null}
        </div>
        <div className="comments">
          {comments.map((comment, index) => {
            let isView = commentFrontViewCount < index;
            return isView ? (
              <Comment
                key={index}
                commentContent={comment}
                postModalOpen={post_modalOpen}
              />
            ) : null;
          })}
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
              ref={commentPostButton}
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

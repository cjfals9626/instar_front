import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import FollowMember from "./FollowMember";
import "../css/Profile.css";
import InstarFoot from "./InstarFoot";

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

export default function Profile(props) {
  const { children } = props;
  const [memberData, setMemberData] = useState("");
  const botContentClick = useRef([]);
  const imageInput = useRef();
  const changeProfileImgButton = useRef();
  const [profileImgFile, setprofileImgFile] = useState();
  const [profileChange_modalOpen, setProfileChangeModalOpen] = useState(false);
  const [isFollowedUser, setIsFollowedUser] = useState(false);
  const [firstRender, setFirstRender] = useState(false);
  const [unfollowModalOpen, setUnFollowModalOpen] = useState(false);
  const [following, setFollowing] = useState([]);
  const [follower, setFollower] = useState([]);
  const [posts, setPosts] = useState([]);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followerModalOpen, setFollowerModalOpen] = useState(false);

  const simplePathName = useLocation().pathname;
  const splitPath = simplePathName.split("/");
  const lastPath = splitPath[splitPath.length - 1];

  function openProfileChangeModal() {
    setProfileChangeModalOpen(true);
  }
  function closeProfileChangeModal() {
    setProfileChangeModalOpen(false);
  }
  function openUnFollowModal() {
    setUnFollowModalOpen(true);
  }
  function closeUnFolloweModal() {
    setUnFollowModalOpen(false);
  }
  function openFollowingModal() {
    setFollowingModalOpen(true);
  }
  function closeFollowingModal() {
    setFollowingModalOpen(false);
  }
  function openFollowerModal() {
    setFollowerModalOpen(true);
  }
  function closeFollowerModal() {
    setFollowerModalOpen(false);
  }
  const onClickBotContent = (e) => {
    if (e.target.tagName === "A") {
      for (var i = 0; i < botContentClick.current.length; i++) {
        botContentClick.current[i].removeAttribute("id");
      }
      e.target.setAttribute("id", "clicked");
    }
  };

  const onCickProfileImageUpload = () => {
    imageInput.current.click();
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("/profile/" + lastPath);
      setMemberData(response.data.member);
      await axios.get("/followingCount/" + lastPath).then((res) => {
        setFollowing(res.data.followingMembers);
      });
      await axios.get("/followerCount/" + lastPath).then((res) => {
        setFollower(res.data.followerMembers);
      });
      await axios.get("/getMyPosts/" + lastPath).then((res) => {
        setPosts(res.data.myPostSetArray);
      });
    }
    fetchData();
    setFirstRender(true);
    closeFollowerModal();
    closeFollowingModal();
  }, [lastPath]);

  const onSubmit = async (file) => {
    try {
      const formData = new FormData();
      formData.append("profileImg", file);

      await axios
        .post(
          "/profile/" + sessionStorage.getItem("userId") + "/changeImg",
          formData,
          {}
        )
        .then((res) => {
          console.log(res);
        });
    } catch (err) {
      console.log(err);
    }
    window.location.reload();
  };
  const onDefaultProfileImg = async () => {
    try {
      await axios.post(
        "/profile/" + sessionStorage.getItem("userId") + "/defaultImg"
      );
    } catch (err) {
      console.log(err);
    }
    window.location.reload();
  };
  const onProfileFileChange = (e) => {
    setprofileImgFile(e.target.files[0]);
    onSubmit(e.target.files[0]);
  };
  const onClickFollow = async () => {
    try {
      await axios
        .post("/follow/" + sessionStorage.getItem("userId"), {
          followTo: memberData._id,
        })
        .then((res) => {
          console.log(res);
        });
    } catch (err) {
      console.log(err);
    }
    window.location.reload();
  };
  useEffect(() => {
    if (firstRender) {
      axios
        .post("/checkFollow/" + sessionStorage.getItem("userId"), {
          followTo: memberData._id,
        })
        .then((res) => {
          setIsFollowedUser(res.data);
        });
    }
  }, [memberData, isFollowedUser]);

  const onClickUnFollow = async () => {
    try {
      await axios
        .post("/unFollow/" + sessionStorage.getItem("userId"), {
          followTo: memberData._id,
        })
        .then((res) => {
          console.log(res);
        });
    } catch (err) {
      console.log(err);
    }
    window.location.reload();
  };
  return (
    <div className="profile_page">
      <div className="top">
        <Modal
          isOpen={profileChange_modalOpen}
          onRequestClose={closeProfileChangeModal}
          style={customStyles}
          ariaHideApp={false}
        >
          <div className="change_profileImg">
            <div className="changeProfileTitle">Change Profile Photo</div>
            <button className="upload_img" onClick={onCickProfileImageUpload}>
              Upload Photo
            </button>
            <button className="to_default_img" onClick={onDefaultProfileImg}>
              Remove Current Photo
            </button>
            <button className="cancel" onClick={closeProfileChangeModal}>
              Cancel
            </button>
          </div>
        </Modal>
        <form
          className="profile_img"
          onClick={
            lastPath === sessionStorage.getItem("userId")
              ? openProfileChangeModal
              : null
          }
        >
          <input
            type="file"
            style={{ display: "none" }}
            ref={imageInput}
            onChange={onProfileFileChange}
          />
          <button
            disabled
            className="change_profile"
            ref={changeProfileImgButton}
          >
            <img src={memberData.profileImg}></img>
          </button>
        </form>
        <div className="topContent">
          <div className="top_of_top">
            <div className="userName">{memberData.userName}</div>
            {lastPath === sessionStorage.getItem("userId") ? (
              <>
                <div className="settings">
                  <a className="settings_button">Edit profile</a>
                </div>

                <div className="profile_options">
                  <button className="option_button">
                    <svg
                      color="#262626"
                      fill="#262626"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        fill="none"
                        r="8.635"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></circle>
                      <path
                        d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 01-.66-.796M7.678 4.522a1.269 1.269 0 01-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 01-.096 1.03m11.8 11.799a1.269 1.269 0 011.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096"
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="other_user_profile">
                <button className="send_dm_button">Message</button>
                {isFollowedUser ? (
                  <>
                    <button
                      className="followed_button"
                      onClick={openUnFollowModal}
                    >
                      <div className="followed_img">
                        <svg
                          aria-label="Following"
                          className="_ab6-"
                          color="#262626"
                          fill="#262626"
                          height="15"
                          role="img"
                          viewBox="0 0 95.28 70.03"
                          width="20"
                        >
                          <path d="M64.23 69.98c-8.66 0-17.32-.09-26 0-3.58.06-5.07-1.23-5.12-4.94-.16-11.7 8.31-20.83 20-21.06 7.32-.15 14.65-.14 22 0 11.75.22 20.24 9.28 20.1 21 0 3.63-1.38 5.08-5 5-8.62-.1-17.28 0-25.98 0zm19-50.8A19 19 0 1164.32 0a19.05 19.05 0 0118.91 19.18zM14.76 50.01a5 5 0 01-3.37-1.31L.81 39.09a2.5 2.5 0 01-.16-3.52l3.39-3.7a2.49 2.49 0 013.52-.16l7.07 6.38 15.73-15.51a2.48 2.48 0 013.52 0l3.53 3.58a2.49 2.49 0 010 3.52L18.23 48.57a5 5 0 01-3.47 1.44z"></path>
                        </svg>
                      </div>
                    </button>
                    <Modal
                      isOpen={unfollowModalOpen}
                      onRequestClose={closeUnFolloweModal}
                      style={customStyles}
                      ariaHideApp={false}
                    >
                      <div className="unfollow_modal">
                        <button
                          className="unfollow_button"
                          onClick={onClickUnFollow}
                        >
                          Unfollow
                        </button>
                        <button
                          className="cancel"
                          onClick={closeUnFolloweModal}
                        >
                          Cancel
                        </button>
                      </div>
                    </Modal>
                  </>
                ) : (
                  <button className="follow_button" onClick={onClickFollow}>
                    <div>Follow</div>
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="top_of_mid">
            <div className="post_count">{posts.length} post</div>
            <div className="follower" onClick={openFollowerModal}>
              {follower.length} follower
            </div>
            <Modal
              isOpen={followerModalOpen}
              onRequestClose={closeFollowerModal}
              style={customStyles}
              ariaHideApp={false}
            >
              <div className="followerModal">
                <div className="followerTitle">Followers</div>
                {follower.map((user, id) => {
                  return <FollowMember key={id} user={user} />;
                })}
              </div>
            </Modal>
            <div className="following" onClick={openFollowingModal}>
              {following.length} following
            </div>
            <Modal
              isOpen={followingModalOpen}
              onRequestClose={closeFollowingModal}
              style={customStyles}
              ariaHideApp={false}
            >
              <div className="followingModal">
                <div className="followingTitle">Following</div>

                {following.map((user, id) => {
                  return <FollowMember key={id} user={user} />;
                })}
              </div>
            </Modal>
          </div>

          <div className="top_of_bot">
            <div className="fullName">{memberData.fullName}</div>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="children_page" onClick={onClickBotContent}>
          <Link
            to={"/profile/posts/" + lastPath}
            className="children_post"
            id="clicked"
            ref={(el) => (botContentClick.current[0] = el)}
          >
            POSTS
          </Link>
          <Link
            to={"/profile/saved/" + lastPath}
            className="children_saved"
            ref={(el) => (botContentClick.current[1] = el)}
          >
            SAVED
          </Link>
          <a
            className="children_tagged"
            ref={(el) => (botContentClick.current[2] = el)}
          >
            TAGGED
          </a>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

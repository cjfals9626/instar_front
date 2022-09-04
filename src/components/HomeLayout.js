import "../css/HomeLayout.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import NewPost from "./NewPost";
import SearchMember from "./SearchMember";

export default function HomeLayout(props) {
  const { children } = props;
  const [user, setUser] = useState("");
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const searchInput = useRef(null);
  const searchBlock = useRef(null);
  const magnifierRef = useRef(null);
  const searchContentRef = useRef(null);
  const allClearRef = useRef(null);
  const searchListRef = useRef(null);
  const menuIconRef = useRef([]);
  const profileModalRef = useRef(null);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);

  function onClickAllClear() {
    magnifierRef.current.style.display = "none";

    searchContentRef.current.textContent = "Search";
    searchContentRef.current.style.visibility = "visible";
    setSearchKeyWord("");
    searchInput.current.blur();
  }
  const onChangeSearch = useCallback((e) => {
    setSearchKeyWord(e.target.value);
    if (e.target.value === "") {
      searchContentRef.current.textContent = "Search";
      searchContentRef.current.style.visibility = "visible";
    } else {
      searchContentRef.current.textContent = e.target.value;
      searchContentRef.current.style.visibility = "hidden";
    }
  }, []);
  const onClickSearchBlock = () => {
    searchInput.current.style = "visibility: visible";
    searchInput.current.focus();
  };

  function useListOutsideClick(ref) {
    function handleClickListOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        allClearRef.current.style.display = "none";
        magnifierRef.current.style.display = "block";
        searchListRef.current.style.display = "none";
        if (searchKeyWord) {
          searchInput.current.style = "visibility: hidden";
        }
        searchContentRef.current.style.visibility = "visible";
      } else {
        allClearRef.current.style.display = "block";
        magnifierRef.current.style.display = "none";
        searchListRef.current.style.display = "block";

        if (searchKeyWord) {
          searchContentRef.current.style.visibility = "hidden";
        }
      }
    }

    useEffect(() => {
      document.addEventListener("mousedown", handleClickListOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickListOutside);
      };
    });
  }

  useListOutsideClick(searchBlock);

  function useProfileOutsideClick(ref) {
    function handleClickProfileOutside(event) {
      if (
        ref.current[4] &&
        !ref.current[4].contains(event.target) &&
        !profileModalRef.current.contains(event.target)
      ) {
        profileModalRef.current.style.display = "none";
      } else {
        profileModalRef.current.style.display = "flex";
      }
    }

    useEffect(() => {
      document.addEventListener("mousedown", handleClickProfileOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickProfileOutside);
      };
    });
  }

  useProfileOutsideClick(menuIconRef);

  const onClickMenuicon = (e) => {
    if (e.target.tagName === "A") {
      for (var i = 0; i < menuIconRef.current.length; i++) {
        menuIconRef.current[i].classList.remove("active");
      }
      e.target.className += " active";
    }
  };

  // const onClickStopPropa = (e) => {
  //   e.target.stopPropagation();
  // };

  function openNewPost() {
    setNewPostOpen(true);
  }
  function closeNewPost() {
    setNewPostOpen(false);
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

  const onLogout = () => {
    sessionStorage.removeItem("userId");
    document.location.href = "/login";
  };
  //검색
  useEffect(() => {
    async function fetchData() {
      if (searchKeyWord === "") {
        const response = await axios.post("/getUsers", {
          userId: sessionStorage.getItem("userId"),
        });
        setSearchedUsers(response.data.members);
      } else {
        const response = await axios.post(
          "/findUsers/" + sessionStorage.getItem("userId") + "/" + searchKeyWord
        );
        setSearchUsers(response.data.member);
      }
    }
    fetchData();
  }, [searchKeyWord, searchedUsers]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "/profile/" + sessionStorage.getItem("userId")
      );

      setUser(response.data.member);
    }
    fetchData();
  }, []);
  const onClickSearchRecordClear = async () => {
    await axios.post("/searchRecordAllClear", {
      userId: sessionStorage.getItem("userId"),
    });
    setSearchedUsers((searchedUsers) => []);
  };
  if (
    window.location.pathname === "/login" ||
    window.location.pathname === "/sign"
  )
    return null;
  return (
    <>
      <div className="homelayout">
        <div className="header">
          <div className="elements">
            <div className="logo_field">
              <Link to="/home" className="logo"></Link>
            </div>
            <div className="search_contain" ref={searchBlock}>
              <form className="search_field" onClick={onClickSearchBlock}>
                <input
                  className="search"
                  onChange={onChangeSearch}
                  ref={searchInput}
                  value={searchKeyWord}
                ></input>
                <div className="search_water_mark">
                  <span className="magnifier" ref={magnifierRef}></span>
                  <span className="content" ref={searchContentRef}>
                    Search
                  </span>
                </div>
                <span
                  className="all_clear"
                  onClick={onClickAllClear}
                  ref={allClearRef}
                ></span>
                <div className="searchList" ref={searchListRef}>
                  <div className="result">
                    <div className="search_members">
                      {searchKeyWord === "" ? (
                        <>
                          <div className="top_content">
                            <div className="recent_title">Recent</div>
                          </div>
                          {searchedUsers.length === 0 ? (
                            <div className="no_searched">
                              No recent searches.
                            </div>
                          ) : (
                            <>
                              <div
                                className="clear_members"
                                onClick={onClickSearchRecordClear}
                              >
                                Clear all
                              </div>
                              <div className="search_mmeber_list">
                                {searchedUsers.map((user, id) => {
                                  return (
                                    <SearchMember
                                      key={id}
                                      user={user}
                                      isRecord={true}
                                      setSearchedUsers={setSearchedUsers}
                                    />
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        searchUsers.map((user, id) => {
                          return <SearchMember key={id} user={user} />;
                        })
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="side_menu">
              <div className="menus" onClick={onClickMenuicon}>
                <div className="home">
                  <Link
                    to="/home"
                    className="menu_icon home_icon "
                    ref={(el) => (menuIconRef.current[0] = el)}
                  ></Link>
                </div>
                <div className="instarDM">
                  <Link
                    to="/dm"
                    className="menu_icon instarDM_icon "
                    ref={(el) => (menuIconRef.current[1] = el)}
                  ></Link>
                </div>
                <div className="newPost">
                  <a
                    className="menu_icon newPost_icon "
                    ref={(el) => (menuIconRef.current[2] = el)}
                    onClick={openNewPost}
                  ></a>
                  <Modal
                    isOpen={newPostOpen}
                    onRequestClose={closeNewPost}
                    style={customStyles}
                    ariaHideApp={false}
                  >
                    <NewPost />
                  </Modal>
                </div>
                <div className="recentActivity">
                  <a
                    className="menu_icon recentActivity_icon "
                    ref={(el) => (menuIconRef.current[3] = el)}
                  ></a>
                </div>
                <div className="profile">
                  <a
                    className="menu_icon "
                    ref={(el) => (menuIconRef.current[4] = el)}
                  >
                    <img className="profile_img" src={user.profileImg}></img>
                  </a>
                  <div id="profile_modal" ref={profileModalRef}>
                    <div className="profile_options">
                      <Link
                        to={
                          "/profile/posts/" + sessionStorage.getItem("userId")
                        }
                        className="go_to_profile"
                      >
                        Profile
                      </Link>
                      <Link
                        to={
                          "/profile/saved/" + sessionStorage.getItem("userId")
                        }
                        className="saved"
                      >
                        Saved
                      </Link>
                      <div className="settings">Settings</div>
                      <div className="switch_account">Switch accounts</div>
                      <button
                        type="button"
                        className="logout"
                        onClick={onLogout}
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="real_content">{children}</div>
    </>
  );
}

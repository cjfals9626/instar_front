import React, { useState, useEffect, useRef, useCallback } from "react";
import InstarFoot from "../components/InstarFoot";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

import "../css/Sign.css";
import axios from "axios";

function onInput(inputIndex) {
  var target = document.getElementsByClassName("input_kind");
  target[inputIndex].classList.add("ready_to_input");
}
function offInput(inputIndex) {
  var target = document.getElementsByClassName("input_kind");
  target[inputIndex].classList.remove("ready_to_input");
}

export default function Sign() {
  const [userid_value, setUserIdValue] = useState("");
  const [fullname_value, setFullNameValue] = useState("");
  const [username, setUserNameValue] = useState("");
  const [password_value, setPassword] = useState("");
  const [passwordUnvisible, setPasswordUnvisible] = useState(false);
  const passwordInput = useRef(null);
  const [signCheck, setSignCheck] = useState(false);

  const onChangeUserId = useCallback((e) => {
    setUserIdValue(e.target.value);
    if (e.target.value === "") {
      offInput(0);
      e.target.removeAttribute("id");
    } else {
      onInput(0);
      e.target.id = "inputting";
    }
  }, []);
  const onChangeFullName = useCallback((e) => {
    setFullNameValue(e.target.value);
    if (e.target.value === "") {
      offInput(1);
      e.target.removeAttribute("id");
    } else {
      onInput(1);
      e.target.id = "inputting";
    }
  }, []);
  const onChangeUserName = useCallback((e) => {
    setUserNameValue(e.target.value);
    if (e.target.value === "") {
      offInput(2);
      e.target.removeAttribute("id");
    } else {
      onInput(2);
      e.target.id = "inputting";
    }
  }, []);
  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
    if (e.target.value === "") {
      offInput(3);
      e.target.removeAttribute("id");
    } else {
      onInput(3);
      e.target.id = "inputting";
    }
  }, []);
  function showPasswordToggle() {
    var target = document.getElementsByClassName("password_show");
    target[0].classList.toggle("show_activity");
    target[1].classList.toggle("show_activity");
    setPasswordUnvisible((current) => !current);
    if (target[1].classList.contains("show_activity")) {
      passwordInput.current.type = "text";
    } else {
      passwordInput.current.type = "password";
    }
  }
  useEffect(() => {
    var target = document.getElementsByClassName("password_show");
    const password = document.getElementsByName("password")[0].value;
    let passwordVisible;
    if (passwordUnvisible) {
      passwordVisible = 1;
    } else {
      passwordVisible = 0;
    }
    if (password) {
      target[passwordVisible].classList.add("show_activity");
    } else {
      target[passwordVisible].classList.remove("show_activity");
    }
  }, [passwordUnvisible, password_value]);

  const signValid = () => {
    const regPhone = /^010-?([0-9]{4})-?([0-9]{4})$/;
    const regEmail =
      /^[0-9a-zA-Z]?([0-9a-zA-Z]{4,20})*@[a-zA-Z]*\.[a-zA-Z]{2,3}$/;
    const regFullName = /[0-9a-zA-Z]{1,}/;
    const regUserName = /[^]{1,}/;
    const regPassword = /[0-9a-zA-Z`~!@#$%^&*]{6,}/;
    const newSign = {
      id_phoneOrEmail: userid_value,
      fullName: fullname_value,
      userName: username,
      password: password_value,
    };

    var valid = document.getElementsByClassName("input_valid");
    var invalid = document.getElementsByClassName("input_invalid");

    for (var key in newSign) {
      if (
        key === "id_phoneOrEmail" &&
        (regPhone.test(newSign[key]) === true ||
          regEmail.test(newSign[key]) === true)
      ) {
        valid[0].style.display = "block";
        invalid[0].style.display = "none";
      } else if (
        (key === "id_phoneOrEmail" && regPhone.test(newSign[key]) === false) ||
        (regEmail.test(newSign[key] === false) && userid_value)
      ) {
        valid[0].style.display = "none";
        invalid[0].style.display = "block";
      } else if (userid_value.length === 0 || userid_value === undefined) {
        valid[0].style.display = "none";
        invalid[0].style.display = "none";
      }

      if (key === "fullName" && regFullName.test(newSign[key]) === true) {
        valid[1].style.display = "block";
        invalid[1].style.display = "none";
      } else if (
        key === "fullName" &&
        regFullName.test(newSign[key]) === false &&
        fullname_value
      ) {
        valid[1].style.display = "none";
        invalid[1].style.display = "block";
      } else if (fullname_value.length === 0 || fullname_value === undefined) {
        valid[1].style.display = "none";
        invalid[1].style.display = "none";
      }
      if (key === "userName" && regUserName.test(newSign[key]) === true) {
        valid[2].style.display = "block";
        invalid[2].style.display = "none";
      } else if (
        key === "userName" &&
        regUserName.test(newSign[key]) === false &&
        username
      ) {
        valid[2].style.display = "none";
        invalid[2].style.display = "block";
      } else if (username.length === 0 || username === undefined) {
        valid[2].style.display = "none";
        invalid[2].style.display = "none";
      }
      if (key === "password" && regPassword.test(newSign[key]) === true) {
        valid[3].style.display = "block";
        invalid[3].style.display = "none";
      } else if (
        key === "password" &&
        regPassword.test(newSign[key]) === false &&
        password_value
      ) {
        valid[3].style.display = "none";
        invalid[3].style.display = "block";
      } else if (password_value.length === 0 || password_value === undefined) {
        valid[3].style.display = "none";
        invalid[3].style.display = "none";
      }

      var target = document.getElementsByClassName("sign_button");
      if (
        valid[0].style.display === "block" &&
        valid[1].style.display === "block" &&
        valid[2].style.display === "block" &&
        valid[3].style.display === "block"
      ) {
        target[0].removeAttribute("disabled");
        target[0].setAttribute("id", "sign_activity");
      } else {
        target[0].setAttribute("disabled", "disabled");
        target[0].removeAttribute("id");
      }
    }
  };

  function toFacebookLogin() {
    window.location.href =
      "https://www.facebook.com/login.php?skip_api_login=1&api_key=124024574287414&kid_directed_site=0&app_id=124024574287414&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Foauth%3Fclient_id%3D124024574287414%26redirect_uri%3Dhttps%253A%252F%252Fwww.instagram.com%252Faccounts%252Fsignup%252F%26state%3D%257B%2522fbLoginKey%2522%253A%25221ur1fgs1o8ht682o3iv41ji38zo4rrsde14rmsoi1cn0nree2a4u9%2522%252C%2522fbLoginReturnURL%2522%253A%2522%252Ffxcal%252Fdisclosure%252F%2522%257D%26scope%3Demail%26response_type%3Dcode%252Cgranted_scopes%26locale%3Den_US%26ret%3Dlogin%26fbapp_pres%3D0%26logger_id%3Dd1235c5e-2ff1-4100-8294-326abc1527fb%26tp%3Dunspecified&cancel_url=https%3A%2F%2Fwww.instagram.com%2Faccounts%2Fsignup%2F%3Ferror%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26state%3D%257B%2522fbLoginKey%2522%253A%25221ur1fgs1o8ht682o3iv41ji38zo4rrsde14rmsoi1cn0nree2a4u9%2522%252C%2522fbLoginReturnURL%2522%253A%2522%252Ffxcal%252Fdisclosure%252F%2522%257D%23_%3D_&display=page&locale=en_US&pl_dbl=0";
  }

  useEffect(() => {
    signValid();
  }, [userid_value, fullname_value, username, password_value]);

  const onSubmit = (event) => {
    axios
      .post("/sign/member", {
        id: userid_value,
        userName: username,
        fullName: fullname_value,
        password: password_value,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          alert("회원가입 성공!");
          setSignCheck(true);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 400) {
          alert("회원가입 실패!");
        }
      });

    event.preventDefault();
  };

  return (
    <>
      <div className="sign_up_field">
        <div className="top">
          <div className="logo">
            <img
              className="sign_logo"
              src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
            ></img>
          </div>
          <div className="introduction">
            <h4 className="content">
              Sign up to see photos and videos from your friends.
            </h4>
          </div>
          <div className="facebook_login">
            <button className="button" onClick={toFacebookLogin}>
              <span className="facebook_logo"></span>
              <span className="content">Log in with Facebook</span>
            </button>
          </div>
          <div className="login_sign_horizon">
            <hr />
            <span className="or">OR</span>
          </div>

          <div className="sign_input_field">
            <form className="userid_password" onSubmit={onSubmit}>
              <div className="useridfield">
                <span className="input_kind  ">Mobile Number or Email</span>
                <input
                  className="userid_password_input_field  "
                  type="text"
                  name="userid"
                  value={userid_value}
                  onChange={onChangeUserId}
                ></input>
                <span className="input_valid"></span>
                <span className="input_invalid"></span>
              </div>
              <div className="fullnamefield">
                <span className="input_kind  ">Full Name</span>
                <input
                  className="userid_password_input_field  "
                  type="text"
                  name="fullname"
                  value={fullname_value}
                  onChange={onChangeFullName}
                ></input>
                <span className="input_valid"></span>
                <span className="input_invalid"></span>
              </div>
              <div className="usernamefield">
                <span className="input_kind  ">UserName</span>
                <input
                  className="userid_password_input_field  "
                  type="text"
                  name="username"
                  value={username}
                  onChange={onChangeUserName}
                ></input>
                <span className="input_valid"></span>
                <span className="input_invalid"></span>
              </div>
              <div className="passwordfield">
                <span className="input_kind  ">Password</span>
                <input
                  className="userid_password_input_field  "
                  type="password"
                  name="password"
                  value={password_value}
                  onChange={onChangePassword}
                  ref={passwordInput}
                ></input>
                <span className="input_valid"></span>
                <span className="input_invalid"></span>
                <span
                  className="password_show  password_visible  "
                  onClick={showPasswordToggle}
                >
                  Show
                </span>
                <span
                  className="password_show  password_unvisible  "
                  onClick={showPasswordToggle}
                >
                  Hide
                </span>
              </div>
              <p className="introduce">
                People who use our service may have uploaded your contact
                information to Instagram.
                <a
                  href="https://www.facebook.com/help/instagram/261704639352628"
                  tabIndex="0"
                  target="_blank"
                >
                  Learn More
                </a>
              </p>

              <div className="sign_button_field">
                <button type="submit" className="sign_button" disabled="false">
                  <div className="sign_button_text">Sign up</div>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="bottom">
          <div className="go_login_page">
            <span className="content">
              Have an account?
              <Link className="go_login_page_button" to="/login">
                Log in
              </Link>
            </span>
          </div>
          <div className="download_app">
            <div className="content">Get the app.</div>
            <div className="store_link">
              <a href="https://itunes.apple.com/app/instagram/id389801252?pt=428156&ct=igweb.loginPage.badge&mt=8&vt=lo">
                <img
                  className="apple"
                  src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png"
                />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=utm_source%3Dinstagramweb%26utm_campaign%3DloginPage%26ig_mid%3DC0851FF4-BF4B-4C7B-81C0-412CBBBBF79D%26utm_content%3Dlo%26utm_medium%3Dbadge">
                <img
                  className="android"
                  src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      {signCheck && <Navigate to="/login" />}
      <InstarFoot></InstarFoot>
    </>
  );
}

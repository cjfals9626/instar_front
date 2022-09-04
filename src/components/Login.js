import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import InstarFoot from "../components/InstarFoot";
import "../css/Login.css";

function changePhoneView(phoneViewIndex) {
  var target = document.getElementsByClassName("each_view");
  if (phoneViewIndex == 0) {
    target[3].classList.remove("visible");
  } else {
    target[phoneViewIndex - 1].classList.remove("visible");
  }
  target[phoneViewIndex].classList.toggle("visible");
}

function onInput(inputIndex) {
  var target = document.getElementsByClassName("input_kind");
  target[inputIndex].classList.add("ready_to_input");
}
function offInput(inputIndex) {
  var target = document.getElementsByClassName("input_kind");
  target[inputIndex].classList.remove("ready_to_input");
}

export default function Login() {
  const [phoneView, setPhoneView] = useState(1);
  const [userid_value, setUserIdValue] = useState("");
  const [password_value, setPassword] = useState("");
  const [passwordUnvisible, setPasswordUnvisible] = useState(false);
  const passwordInput = useRef(null);

  let sessionStorage = window.sessionStorage;

  function loginButtonActivity() {
    var target = document.getElementsByClassName("login_button");

    const userid = document.getElementsByName("userid")[0].value;
    const passwordLength =
      document.getElementsByName("password")[0].value.length;

    if (userid && passwordLength >= 6) {
      target[0].removeAttribute("disabled");
      target[0].setAttribute("id", "login_activity");
    } else {
      target[0].setAttribute("disabled", "disabled");
      target[0].removeAttribute("id");
    }
  }
  const onChangeUserId = useCallback((e) => {
    setUserIdValue(e.target.value);
    if (e.target.value === "") {
      offInput(0);
      e.target.removeAttribute("id");
    } else {
      onInput(0);
      e.target.id = "inputting";
    }
    loginButtonActivity();
  }, []);
  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
    if (e.target.value === "") {
      offInput(1);
      e.target.removeAttribute("id");
    } else {
      onInput(1);
      e.target.id = "inputting";
    }

    loginButtonActivity();
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
    var timer = setInterval(() => {
      if (phoneView === 3) {
        setPhoneView(0);
      } else {
        setPhoneView((preNum) => preNum + 1);
      }
      changePhoneView(phoneView);
    }, 5000);
    return () => clearInterval(timer);
  });

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

  function toFacebookLogin() {
    window.location.href =
      "https://www.facebook.com/login.php?skip_api_login=1&api_key=124024574287414&kid_directed_site=0&app_id=124024574287414&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Foauth%3Fclient_id%3D124024574287414%26redirect_uri%3Dhttps%253A%252F%252Fwww.instagram.com%252Faccounts%252Fsignup%252F%26state%3D%257B%2522fbLoginKey%2522%253A%2522v80f0i17fd3xk10b9fvsq022ei5k75on4xn3zx4fugjb1e5ns1b%2522%252C%2522fbLoginReturnURL%2522%253A%2522%252Ffxcal%252Fdisclosure%252F%253Fnext%253D%25252F%2522%257D%26scope%3Demail%26response_type%3Dcode%252Cgranted_scopes%26locale%3Den_US%26ret%3Dlogin%26fbapp_pres%3D0%26logger_id%3Dd5ec0bca-666a-4c16-acbe-07d0de7fff34%26tp%3Dunspecified&cancel_url=https%3A%2F%2Fwww.instagram.com%2Faccounts%2Fsignup%2F%3Ferror%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26state%3D%257B%2522fbLoginKey%2522%253A%2522v80f0i17fd3xk10b9fvsq022ei5k75on4xn3zx4fugjb1e5ns1b%2522%252C%2522fbLoginReturnURL%2522%253A%2522%252Ffxcal%252Fdisclosure%252F%253Fnext%253D%25252F%2522%257D%23_%3D_&display=page&locale=en_US&pl_dbl=0";
  }

  const onSubmit = async (e) => {
    try {
      e.preventDefault(); // 불필요한 렌더링 방지

      axios
        .post(
          "/login/member",
          {
            id: userid_value,
            password: password_value,
          },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            alert("로그인 성공!");
            sessionStorage.setItem("userId", res.data);
            document.location.href = "/";
          }
        });
    } catch (err) {
      if (err.response.status === 401) {
        alert("로그인 실패!");
        setUserIdValue("");
        setPassword("");
      }
    }
  };
  return (
    <div className="login_contain_foot">
      <div className="login">
        <div className="login_view">
          <div className="login_left">
            <div className="phone">
              <img
                alt=""
                className="each_view  visible"
                src="https://www.instagram.com/static/images/homepage/screenshots/screenshot1.png/fdfe239b7c9f.png"
              />
              <img
                alt=""
                className="each_view  "
                src="https://www.instagram.com/static/images/homepage/screenshots/screenshot2.png/4d62acb667fb.png"
              />
              <img
                alt=""
                className="each_view  "
                src="https://www.instagram.com/static/images/homepage/screenshots/screenshot3.png/94edb770accf.png"
              />
              <img
                alt=""
                className="each_view  "
                src="https://www.instagram.com/static/images/homepage/screenshots/screenshot4.png/a4fd825e3d49.png"
              />
            </div>
          </div>
          <div className="login_right">
            <div className="userid_password_inputfield">
              <div className="logo">
                <img src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" />
              </div>
              <form className="userid_password" onSubmit={onSubmit}>
                <div className="useridfield">
                  <span className="input_kind  ">
                    Phone number, username, or email
                  </span>
                  <input
                    className="userid_password_input_field  "
                    type="text"
                    name="userid"
                    value={userid_value}
                    onChange={onChangeUserId}
                  ></input>
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
                <div className="login_button_field">
                  <button className="login_button" disabled={false}>
                    <div className="login_button_text">Log in</div>
                  </button>
                </div>
              </form>
              <div className="login_sign_horizon">
                <hr />
                <span className="or">OR</span>
              </div>
              <form className="facebook_login">
                <button
                  className="facebook_login_button"
                  onClick={toFacebookLogin}
                >
                  <span className="facebook_logo"></span>
                  <span className="facebook_login_content">
                    Log in with Facebook
                  </span>
                </button>
              </form>
              <div className="forget_password">
                <a className="password_find">Forgot password?</a>
              </div>
            </div>
            <div className="sign_field">
              <div className="to_sign">
                <p className="sign_content">
                  Don't have an account?
                  <Link to="/sign" className="sign_button">
                    Sign up
                  </Link>
                </p>
              </div>
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
      </div>
      {sessionStorage.getItem("userId") !== null && <Navigate to="/home" />}

      <InstarFoot></InstarFoot>
    </div>
  );
}

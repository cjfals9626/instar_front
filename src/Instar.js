import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Instar.css";
import Login from "./components/Login";
import Sign from "./components/Sign";
import HomeLayout from "./components/HomeLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ProfilePost from "./components/ProfilePost";
import ProfileSaved from "./components/ProfileSaved";
import DirectMessage from "./components/DirectMessage";

import Chat from "./components/Chat";
import Join from "./components/Join";

function Instar() {
  return (
    <Router>
      <HomeLayout />
      <Routes>
        <Route path="/join" element={<Join />} />
        <Route path="/chat" element={<Chat />} />

        <Route exact path="/" element={<Navigate to="/login" />}></Route>

        <Route exact path="/login" element={<Login />} />
        <Route exact path="/sign" element={<Sign />} />
        {/* <Route exact path="/" element={<Navigate to="/home" />}></Route> */}
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/dm" element={<DirectMessage />} />
        <Route
          exact
          path="/profile/*"
          element={
            <Profile>
              <Routes>
                <Route
                  exact
                  path="/posts/*"
                  element={<ProfilePost></ProfilePost>}
                ></Route>
                <Route
                  exact
                  path="/saved/*"
                  element={<ProfileSaved></ProfileSaved>}
                ></Route>
              </Routes>
            </Profile>
          }
        />
      </Routes>
    </Router>
  );
}

export default Instar;

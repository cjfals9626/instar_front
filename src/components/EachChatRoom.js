import React, { useState, useEffect, useRef, useCallback } from "react";
import "../css/EachChatRoom.css";

export default function EachChatRoom(props) {
  const onClick = () => {
    props.changeRoom(props.chatRoom.roomName);
  };
  return (
    <div className="each_room" onClick={onClick}>
      <div className="room_name">{props.chatRoom.roomName}</div>
    </div>
  );
}

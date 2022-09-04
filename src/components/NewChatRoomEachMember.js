import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

export default function NewChatRoomEachMember(props) {
  const checkFillRef = useRef(null);
  const checkEmptyRef = useRef(null);
  const checkContain = useRef(null);
  const [checked, setChecked] = useState(false);

  // useEffect(() => {
  //   if (checked) {
  //     checkFillRef.current.style.display = "none";
  //     checkEmptyRef.current.style.display = "block";
  //     checkEmptyRef.current.style.color = "#0095f6";
  //     checkEmptyRef.current.style.fill = "#0095f6";
  //     props.setSelectedMembers((selectedMembers) => [
  //       ...selectedMembers,
  //       props.user,
  //     ]);
  //     props.setSearchKeyWord("");
  //   } else {
  //     checkFillRef.current.style.display = "block";
  //     checkEmptyRef.current.style.display = "none";
  //     checkEmptyRef.current.style.color = "#262626";
  //     checkEmptyRef.current.style.fill = "#262626";
  //     props.setSelectedMembers(
  //       props.selectedMembers.filter(
  //         (_, index) =>
  //           index !==
  //           props.selectedMembers.findIndex(
  //             (v) => v.userName === props.user.userName
  //           )
  //       )
  //     );
  //   }
  // }, [checked]);

  // const onCheck = () => {
  //   setChecked((current) => !current);
  // };
  const onCheck = () => {
    if (checked) {
      props.setSelectedMembers(
        props.selectedMembers.filter(
          (_, index) =>
            index !==
            props.selectedMembers.findIndex(
              (v) => v.userName === props.user.userName
            )
        )
      );
    } else {
      props.setSelectedMembers((selectedMembers) => [
        ...selectedMembers,
        props.user,
      ]);
      props.setSearchKeyWord("");
    }
  };
  useEffect(() => {
    if (
      props.selectedMembers.findIndex(
        (v) => v.userName === props.user.userName
      ) !== -1
    ) {
      setChecked(true);

      checkFillRef.current.style.display = "none";
      checkEmptyRef.current.style.display = "block";
      checkEmptyRef.current.style.color = "#0095f6";
      checkEmptyRef.current.style.fill = "#0095f6";
    } else {
      setChecked(false);

      checkFillRef.current.style.display = "block";
      checkEmptyRef.current.style.display = "none";
      checkEmptyRef.current.style.color = "#262626";
      checkEmptyRef.current.style.fill = "#262626";
    }
  }, [props.selectedMembers]);
  return (
    <div className="each_members">
      <div className="profile_img">
        <img src={props.user.profileImg}></img>
      </div>
      <div className="text_content">
        <div className="user_name">{props.user.userName}</div>
      </div>
      <div className="checkCircle" onClick={onCheck}>
        <svg
          ref={checkContain}
          aria-label="Toggle selection"
          color="#262626"
          //color="#0095f6"
          fill="#262626"
          //fill="#0095f6"
          height="24"
          role="img"
          viewBox="0 0 24 24"
          width="24"
        >
          <circle
            className="check_empty"
            cx="12.008"
            cy="12"
            fill="none"
            r="11.25"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="1.5"
            ref={checkFillRef}
          ></circle>
          <path
            className="check_fill"
            ref={checkEmptyRef}
            d="M12.001.504a11.5 11.5 0 1011.5 11.5 11.513 11.513 0 00-11.5-11.5zm5.706 9.21l-6.5 6.495a1 1 0 01-1.414-.001l-3.5-3.503a1 1 0 111.414-1.414l2.794 2.796L16.293 8.3a1 1 0 011.414 1.415z"
          ></path>
        </svg>
      </div>
    </div>
  );
}

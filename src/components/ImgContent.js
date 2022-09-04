import React, { useState, useEffect, useRef, useCallback } from "react";

export default function ImgContent(props) {
  const videoRef = useRef(null);

  window.addEventListener("scroll", (event) => {
    let rect = videoRef.current.getBoundingClientRect();
    if (-200 <= rect.y && rect.y <= 800) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  });
  return (
    <div className="media">
      {props.imgsrc.includes(
        ".mp4" ||
          ".m4v" ||
          ".avi" ||
          ".wmv" ||
          ".mpg" ||
          ".mpeg" ||
          ".mov" ||
          ".webm"
      ) ? (
        <video
          className="video_content"
          src={props.imgsrc}
          controls
          ref={videoRef}
          muted
        />
      ) : (
        <img className="content" src={props.imgsrc}></img>
      )}
    </div>
  );
}

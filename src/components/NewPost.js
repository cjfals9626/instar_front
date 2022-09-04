import React, { useState, useEffect, useRef, useCallback } from "react";
import "../css/NewPost.css";
import Carousel from "react-material-ui-carousel";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

export default function NewPost() {
  const mediaInput = useRef(null);
  const [files, setFiles] = useState([]);
  const [mediaSrcBlob, setMedaiSrcBlob] = useState([]);
  const [textContent_value, setTextContentValue] = useState("");

  const onChangeComment = useCallback((e) => {
    setTextContentValue(e.target.value);
  }, []);

  const handleAddImages = (event) => {
    setFiles([...files, ...event.target.files]);
    const mediaLists = event.target.files;
    let mediaUrlLists = [...mediaSrcBlob];

    for (let i = 0; i < mediaLists.length; i++) {
      let media = {
        blobText: "",
        type: "",
      };
      media.blobText = URL.createObjectURL(mediaLists[i]);
      media.type = mediaLists[i].type;
      const currentImageUrl = media;
      mediaUrlLists.push(currentImageUrl);
    }

    if (mediaUrlLists.length > 10) {
      mediaUrlLists = mediaUrlLists.slice(0, 10);
    }
    console.log(event.target.files);
    setMedaiSrcBlob(mediaUrlLists);
  };

  const onSubmit = async (e) => {
    async function postSubmit() {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("mediaContents", files[i]);
      }
      formData.append("textContent", textContent_value);
      axios
        .post("/post/newPost/" + sessionStorage.getItem("userId"), formData, {})
        .then((res) => {
          window.location.reload();
          console.log(res);
        });
    }
    postSubmit();
  };
  // X버튼 클릭 시 이미지 삭제
  const handleDeleteImage = (id) => {
    setMedaiSrcBlob(mediaSrcBlob.filter((_, index) => index !== id));
    setFiles(files.filter((_, index) => index !== id));
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  return (
    <form className="newPostModal" onSubmit={onSubmit}>
      <div className="head">
        <div className="text">Create new post</div>
        <div className="submit" onClick={onSubmit}>
          Done
        </div>
        {/* <button type="submit" className="submit">
          Done
        </button> */}
      </div>
      <div className="upload">
        <div className="media">
          <label for="media_uploads" className="upload_label">
            동영상, 이미지 추가
          </label>
          <input
            className="media_input"
            id="media_uploads"
            type="file"
            accept="image/*,video/mp4,video/mkv, video/x-m4v,video/*"
            multiple
            required
            capture="user"
            onChange={handleAddImages}
            ref={mediaInput}
          />
          {/* <Carousel
            autoPlay={false}
            navButtonsAlwaysVisible={true}
            animation={"slide"}
            cycleNavigation={false}
          >
            {mediaSrcBlob.map((media, id) => {
              return (
                <div className="preview" key={id}>
                  {media.type.includes("video") ? (
                    <video
                      className="video_content"
                      src={media.blobText}
                      controls
                    />
                  ) : (
                    <img src={media.blobText} className="content" />
                  )}
                  <div
                    className="deleteButton"
                    onClick={() => handleDeleteImage(id)}
                  >
                    삭제
                  </div>
                </div>
              );
            })}
          </Carousel> */}
          <Slider {...settings}>
            {mediaSrcBlob.map((media, id) => {
              return (
                <div className="preview" key={id}>
                  {media.type.includes("video") ? (
                    <video
                      className="video_content"
                      src={media.blobText}
                      controls
                    />
                  ) : (
                    <img src={media.blobText} className="content" />
                  )}
                  <div
                    className="deleteButton"
                    onClick={() => handleDeleteImage(id)}
                  >
                    삭제
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
        <div className="textContent">
          <div className="textContent_input_field">
            <textarea
              className="textContent_input"
              placeholder="Write a caption..."
              value={textContent_value}
              onChange={onChangeComment}
            ></textarea>
          </div>
        </div>
      </div>
    </form>
  );
}

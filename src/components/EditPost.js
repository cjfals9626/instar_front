import React, { useState, useEffect, useRef, useCallback } from "react";
import "../css/NewPost.css";
import Carousel from "react-material-ui-carousel";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

export default function EditPost(props) {
  const mediaInput = useRef(null);
  const [newFiles, setNewFiles] = useState([]);
  const [mediaSrcBlob, setMedaiSrcBlob] = useState([]);
  const [editMediaBlob, setEditMediaBlob] = useState([]);
  const [removeMediaBlob, setRemoveMediaBlob] = useState([]);
  const [textContent_value, setTextContentValue] = useState("");

  const onChangeComment = useCallback((e) => {
    setTextContentValue(e.target.value);
  }, []);

  const handleAddImages = (event) => {
    setNewFiles([...newFiles, ...event.target.files]);
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

    setMedaiSrcBlob(mediaUrlLists);
  };

  const onSubmit = async (e) => {
    const formData = new FormData();
    for (let i = 0; i < newFiles.length; i++) {
      formData.append("newMediaContents", newFiles[i]);
    }
    formData.append("textContent", textContent_value);
    formData.append("removeMedia", removeMediaBlob);
    axios.post("/post/editPost/" + props.postId, formData, {}).then((res) => {
      window.location.reload();
      console.log(res);
    });
  };
  // X버튼 클릭 시 이미지 삭제
  const handleDeleteImage = (id) => {
    setMedaiSrcBlob(mediaSrcBlob.filter((_, index) => index !== id));
    if (id < editMediaBlob.length) {
      setRemoveMediaBlob((removeMediaBlob) => [
        ...removeMediaBlob,
        editMediaBlob[id],
      ]);
      setEditMediaBlob(editMediaBlob.filter((_, index) => index !== id));
    } else {
      setNewFiles(
        newFiles.filter((_, index) => index !== id - editMediaBlob.length)
      );
    }
    console.log(removeMediaBlob);
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("/posts/getPost/" + props.postId);
      //서버에서 가져와서 텍스트를 input value에 넣기
      setTextContentValue(response.data.post.textContent);
      //서버에 현재 미디어가 있는 blob값만(미디어) 가져와서 따로 저장
      for (let i = 0; i < response.data.medias.length; i++) {
        setEditMediaBlob((editMediaBlob) => [
          ...editMediaBlob,
          response.data.medias[i].mediaContent,
        ]);
      }
      //미리보기로 이용하기위해 미디어를 추가나 삭제하기 전에 먼저 미리보기 state에 저장
      let mediaUrlLists = [...mediaSrcBlob];
      for (let i = 0; i < response.data.medias.length; i++) {
        let media = {
          blobText: "",
          type: "",
        };
        media.blobText = response.data.medias[i].mediaContent;
        if (
          response.data.medias[0].mediaContent
            .split(".")[1]
            .includes(
              ".mp4" ||
                ".m4v" ||
                ".avi" ||
                ".wmv" ||
                ".mpg" ||
                ".mpeg" ||
                ".mov" ||
                ".webm"
            )
        ) {
          media.type =
            "video/" + response.data.medias[0].mediaContent.split(".")[1];
        } else {
          media.type =
            "image/" + response.data.medias[0].mediaContent.split(".")[1];
        }
        const currentImageUrl = media;
        mediaUrlLists.push(currentImageUrl);
      }

      setMedaiSrcBlob(mediaUrlLists);
      // setExistingMedia({
      //   response.data.medias[i].mediaContent,
      //   ...existingMedia,
      // });

      //console.log(response.data.medias[0].mediaContent.split("."));
      //setPosts(response.data);

      //console.log(url);
      //console.log(file);
      //   let media = {
      //     blobText: "",
      //     type: "",
      //   };
      //   let mediaUrlLists = [];

      //   media.blobText = URL.createObjectURL(file);
      //   media.type = "image/jpg";
      //   const currentImageUrl = media;
      //   mediaUrlLists.push(currentImageUrl);
      //   setMedaiSrcBlob(mediaUrlLists);

      //   setFiles(response.data.medias[0].mediaContent);
    }
    fetchData();
  }, []);
  return (
    <form className="newPostModal" onSubmit={onSubmit}>
      <div className="head">
        <div className="text">Create new post</div>
        <div className="submit" onClick={onSubmit}>
          Done
        </div>
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
            capture="user"
            onChange={handleAddImages}
            ref={mediaInput}
          />
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
            {/* <img
              src="http://localhost:8080/public/mediaContents/cbf752fb-0765-43e5-8813-23bbb32a9181-testpost.png"
              className="content"
            /> */}
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

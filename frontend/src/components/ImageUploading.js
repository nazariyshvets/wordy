import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import "../css/imageUploading.css";

export default function ImageUploading(props) {
  const [profileImage, setProfileImage] = useState();
  const { authTokens } = useContext(AuthContext);
  const api = useAxios();

  const handleImageUpload = (event) => {
    setProfileImage(event.target.files[0]);
  };

  const handleImageFormSubmit = (event) => {
    event.preventDefault();

    if (!profileImage) {
      alert("Select image!");
      return;
    }

    api("/update-profile-image/", {
      method: "put",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authTokens?.access}`,
      },
      data: { url: profileImage },
    })
      .then((response) => {
        alert("Image has been uploaded successfully!");
        setProfileImage(null);
        props.setProfileImageUrl(response.data.url);
        props.close();
      })
      .catch((error) => alert(error.response.data));
  };

  return (
    <div className="image-uploading">
      <form className="image-uploading--form" onSubmit={handleImageFormSubmit}>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleImageUpload}
        />
        <button className="image-uploading--form--upload">Upload</button>

        <div
          className="image-uploading--form--close"
          onClick={() => {
            setProfileImage(null);
            props.close();
          }}
        >
          &#10005;
        </div>
      </form>
    </div>
  );
}

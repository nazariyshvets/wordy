import { useState } from "react";
import { useAlert } from "react-alert";
import FoldedButton from "./FoldedButton";
import useTr from "../hooks/useTr";
import { ImageUploaderTr } from "../translations/componentsTr";
import useAxios from "../hooks/useAxios";
import "../css/ImageUploader.css";

const maxImageSize = 1024 * 100;

function ImageUploader({ setProfileImageUrl, onClose }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { langCode } = useTr();
  const alert = useAlert();
  const api = useAxios();

  function handleImageChange(event) {
    setFile(event.target.files[0]);
  }

  function handleImageUpload() {
    if (isUploading) {
      return;
    }
    if (file.size > maxImageSize) {
      alert.info(ImageUploaderTr.fileExceedsLimit[langCode]);
      return;
    }

    setIsUploading(true);

    api("/profile-image/update/", {
      method: "put",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: { url: file },
    })
      .then((response) => {
        setFile(null);
        setProfileImageUrl(response.data.url);
        alert.success(ImageUploaderTr.imageUploaded[langCode]);
        onClose();
      })
      .catch((error) => {
        alert.error(ImageUploaderTr.error[langCode]);
        console.error("Error uploading image:", error);
      })
      .finally(() => setIsUploading(false));
  }

  function getFileName() {
    if (file) {
      const { name: fileName, size } = file;
      const fileSize = (size / 1000).toFixed(2);
      return `${fileName} - ${fileSize}KB`;
    }

    return "";
  }

  const fileName = getFileName();

  return (
    <div className="image-uploader">
      <form className="image-uploader--form">
        <div
          className="image-uploader--form--close"
          onClick={() => {
            setFile(null);
            onClose();
          }}
        >
          &#10006;
        </div>

        <div className="image-uploader--input-wrapper">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="image-uploader--input"
            onChange={handleImageChange}
          />
          <label htmlFor="file">
            <i className="fa-solid fa-cloud-arrow-up"></i>
            <p className="image-uploader--file-name">{fileName}</p>
          </label>
        </div>

        {file && (
          <FoldedButton
            text={ImageUploaderTr.upload[langCode]}
            onClick={handleImageUpload}
          />
        )}
      </form>
    </div>
  );
}

export default ImageUploader;

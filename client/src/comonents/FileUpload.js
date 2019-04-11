import React, { Fragment, useState } from "react";
import axios from "axios";
import Message from "./Message";
import Progress from "./Progress";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("选择文件");
  const [uploadFile, setUploadFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => {
    console.log(e.target.files);
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => {
          console.log(progressEvent);
          setUploadPercentage(
            parseInt(
              Math.round(progressEvent.loaded * 100) / progressEvent.total
            )
          );
          // 清除进度条数据
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;
      setUploadFile({ fileName, filePath });
      setMessage("文件上传成功!");
    } catch (error) {
      if (error.response.status === 500) {
        setMessage("服务器无响应");
      } else {
        setMessage(error.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {fileName}
          </label>
        </div>

        {/* 进度条 */}
        <Progress percentage={uploadPercentage} />

        <input
          type="submit"
          value="上传"
          className="btn btn-primary btn-block mt-4"
        />
      </form>

    
      {/* 展示区域  */}
      {uploadFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">{uploadFile.fileName}</h3>
            <img style={{ width: "100%" }} src={uploadFile.filePath} alt="" />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;

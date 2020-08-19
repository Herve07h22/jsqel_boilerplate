import React from "react";
import { Card, Form, Button, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";

const UploadForm = ({ form }) => {
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (e.file && e.file.response) return e.file.response.filename;
    return "";
  };

  const token = window.localStorage.getItem("jsqel_token");
  const headers = { Authorization: `Bearer ${token}` };
  const api_url = process.env.NODE_ENV === "production" ? "http://localhost/api/" : "http://localhost:5000/";

  const handleUpload = (values) => console.log("Form values : ", values);

  return (
    <Card title="Upload form (login required!)" className="card">
      <Form onFinish={handleUpload}>
        <Form.Item
          label="File"
          extra="Please upload your file"
          name="upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload name="myFile" action={api_url + "direct/upload"} headers={headers} listType="text" multiple={false}>
            <Button>
              <CloudUploadOutlined /> Upload
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UploadForm;

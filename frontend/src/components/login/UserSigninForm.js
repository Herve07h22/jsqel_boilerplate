import React from "react";
import { useJsqel } from "../../api/jsqel";
import { Input, Card, Form, Button, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
const centeredContainer = {
  maxWidth: "500px",
  minHeight: "100vh",
  display: "flex",
  margin: "auto",
};
const UserSigninForm = ({ history }) => {
  const afterSignin = ({ results, error }) => {
    if (error) {
      console.log("error in UserSigninForm:", error);
      message.error(error);
      clear();
    } else {
      message.success("Got it! Please log in now.");
      history.push("/login");
    }
  };
  const [{ loading }, refresh, clear] = useJsqel("auth/signin", {
    sendItNow: false,
    username: "",
    password: "",
    callback: afterSignin,
  });
  return (
    <div style={centeredContainer}>
      <Card style={{ margin: "auto" }} loading={loading} title="Join the CRM">
        <Form onFinish={refresh}>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              { min: 4, message: "At least 4 chars" },
            ]}
          >
            <Input prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Login" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 4, message: "At least 4 chars" },
            ]}
          >
            <Input
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Mot de passe"
            />
          </Form.Item>
          <Button type="primary" loading={loading} htmlType="submit">
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
};
export default UserSigninForm;

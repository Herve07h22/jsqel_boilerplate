import React from "react";
import { Link } from "react-router-dom";
import { useJsqel } from "../../api/jsqel";
import { useStore } from "../../store/store";
import { Input, Card, Form, Button, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
const centeredContainer = {
  maxWidth: "500px",
  minHeight: "100vh",
  display: "flex",
  margin: "auto",
};
const UserLoginForm = ({ history }) => {
  const { dispatch } = useStore();
  const next = (location) =>
    location && location.search && location.search.length && location.search.startsWith("?next=")
      ? location.search.slice(6)
      : "";
  const afterLogin = ({ results, error }) => {
    if (results && results.token && results.role) {
      dispatch({ type: "LOGIN", ...results });
      message.success("Welcome !");
      console.log("Next :", next(history.location));
      history.push("/" + next(history.location));
    } else {
      message.error("Bad credentials: " + error);
      clear();
    }
  };
  const [{ loading }, refresh, clear] = useJsqel("auth/login", {
    sendItNow: false,
    username: "",
    password: "",
    callback: afterLogin,
  });
  return (
    <div style={centeredContainer}>
      <Card style={{ margin: "auto" }} loading={loading} title="Login">
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
              placeholder="Password"
            />
          </Form.Item>
          <Button type="primary" loading={loading} htmlType="submit">
            Log in
          </Button>
        </Form>
        <p>To log in as admin : Admin/pwdpwd</p>
        <p>
          New to the CRM ? <Link to="/signin">Sign in</Link>{" "}
        </p>
      </Card>
    </div>
  );
};
export default UserLoginForm;

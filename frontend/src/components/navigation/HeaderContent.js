import React from "react";
import { useStore } from "../../store/store";
import { useJsqel } from "../../api/jsqel";
import { Row, Col, Button } from "antd";

const headerStyleLogo = {
  color: "white",
  maxWidth: "200px",
  paddingLeft: "1rem",
};

const headerStyleUser = {
  color: "white",
  padding: "1rem",
};

const headerStyleLogoutButton = {
  marginRight: "1rem",
};

const HeaderContent = () => {
  useJsqel("auth/islogged", {
    sendItNow: true,
    callback: ({ results }) => results && dispatch({ type: "UPDATE", payload: results[0] }),
  });
  const { state, dispatch } = useStore();

  const handleLogout = (e) => dispatch({ type: "LOGOUT" }); // Clear token

  return (
    <Row align="middle" type="flex" justify="space-between">
      <Col>
        <h1 style={headerStyleLogo}>JSqel Demo</h1>
      </Col>
      <Col flex="grow"></Col>

      <Col>
        <span style={headerStyleUser}>Logged as {state.username} </span>
        <Button onClick={handleLogout} style={headerStyleLogoutButton}>
          Log out
        </Button>
      </Col>
    </Row>
  );
};

export default HeaderContent;

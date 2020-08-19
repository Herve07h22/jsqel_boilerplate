import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "antd";
import { DashboardOutlined, ShopOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useStore } from "../../store/store";

const SideNavMenu = ({ location }) => {
  const { state } = useStore();

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname || "/opportunities"]}
      defaultSelectedKeys={["/opportunities"]}
    >
      <Menu.Item key="/opportunities">
        <Link to="/opportunities">
          <ShopOutlined />
          <span className="nav-text">Opportunities</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/leads">
        <Link to="/leads">
          <ShopOutlined />
          <span className="nav-text">Leads</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/upload">
        <Link to="/upload">
          <CloudUploadOutlined />
          <span className="nav-text">Upload</span>
        </Link>
      </Menu.Item>
      {state && state.role === "Admin" && (
        <Menu.Item key="/users">
          <Link to="/users">
            <DashboardOutlined />
            <span className="nav-text">List of users</span>
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default withRouter(SideNavMenu);

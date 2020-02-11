import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Icon, Menu } from 'antd';

const SideNavMenu = ({location}) => (
    <Menu theme="dark" mode="inline" selectedKeys={[location.pathname || '/users' ]} defaultSelectedKeys={['/users']} >
        <Menu.Item key="/users" >
            <Link to="/users" >
                <Icon type="dashboard" />
                <span className="nav-text">List of users</span>
            </Link>
        </Menu.Item>
        <Menu.Item key="/signin" >
            <Link to="/signin" >
                <Icon type="dashboard" />
                <span className="nav-text">New user</span>
            </Link>
        </Menu.Item>
        <Menu.Item key="/opportunities"  >
            <Link to="/opportunities" >
                <Icon type="shop" />
                <span className="nav-text">Opportunities</span>
            </Link>
        </Menu.Item>
        <Menu.Item key="/leads"  >
            <Link to="/leads" >
                <Icon type="shop" />
                <span className="nav-text">Leads</span>
            </Link>
        </Menu.Item>
        <Menu.Item key="/upload"  >
            <Link to="/upload" >
                <Icon type="check-circle" />
                <span className="nav-text">Upload</span>
            </Link>
        </Menu.Item>
    </Menu>
)


export default withRouter(SideNavMenu) 
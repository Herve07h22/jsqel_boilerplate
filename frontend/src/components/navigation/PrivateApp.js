import React from 'react'
import { Route,  Switch, Redirect} from "react-router-dom"
import { Layout } from 'antd'

import UserLoginForm from '../login/UserLoginForm'
import UserSigninForm from '../login/UserSigninForm'
import Upload from '../upload/Upload'
import UserList from '../login/UserList'
import Opportunities from '../crm/Opportunities'
import Leads from '../crm/Leads'
import SideNavMenu from './SideNavMenu'
import HeaderContent from './HeaderContent'

const { Header, Footer, Content, Sider } = Layout

const PrivateApp = () => {  
	return (
    <Layout>
      <Header style={{padding:0}}>
        <HeaderContent />
      </Header>

      <Layout style={{ minHeight: '100vh'}}>
        
        <Sider collapsible>
          <SideNavMenu />
        </Sider>
        
        <Content style={{ padding:'1rem', }} >
          <Switch>
            <Route exact path="/signin"  component={UserSigninForm} />
            <Route exact path="/users"  component={UserList} />
            <Route exact path="/upload"  component={Upload} />
            <Route exact path="/opportunities"  component={Opportunities} />
            <Route exact path="/leads"  component={Leads} />
            <Redirect exact from="/" to="/users" />
            <Route component={UserLoginForm} />
          </Switch>
        </Content>
        
      </Layout>

      <Footer style={{ textAlign: 'center'}}>Jsqel react demo - <a href="https://camilab.co">Camilab 2019</a> </Footer>

    </Layout>
	)
}

export default PrivateApp

import React from 'react'
import {useJsqel, setToken} from './api/jsqel'
import { withStore, useStore } from './store/store'
import {Input, Card, Layout, Spin, Button, Table, Popconfirm, Row, Col} from 'antd'
import './App.css'

import WrappedUserLoginForm from './components/WrappedUserLoginForm'
import WrappedUserSigninForm from './components/WrappedUserSigninForm'
import Upload from './components/Upload'

const reducer = (state, action) => {
  console.log("reducer:", action)
  switch(action.type) {
    case 'LOGIN':
      setToken(action.token)
      return { username: action.username, token:action.token }
    case 'LOGOUT' :
      setToken('')
      return { username: '', token:'' }
    default:
      return state
  }
}

const PrivateHello = () => {
  const {state} = useStore()
  console.log(" PrivateHello state :", state)
  const { Search } = Input
  const [{results, error, loading}, refresh] = useJsqel('test/private_hello', { sendItNow:false, filter : '' })
  return (
    <Card title="Private Hello API" className="card">
      <Search placeholder='Your filter here. Ex : H%' onSearch={filter => refresh({filter})} enterButton />
      { error && <p>Error : {error}</p> }
      { loading ? <Spin /> : results.map( row => <p key={row.id} >{row.message}</p>)  }
      { state && state.username ? <p>{state.username} is logged : the query can be run</p> : <p>This query cannot be run</p>}
    </Card>
  )
}

const Hello = () => {
  const [users, refresh]    = useJsqel('test/hello', { sendItNow:true})
  const [deletedUser, deleteUser] = useJsqel('auth/delete_user', { sendItNow:false, callback: () => refresh() })

  const columns = [
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Role',
      dataIndex: 'role_id',
      key: 'role_id',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => { deleteUser({id:record.id}); }} >
          <Button type="primary">Delete</Button>
        </Popconfirm>
      ),
    },
  ]


  return (
    <Card title="List of users" className="card" actions={[<Button onClick={e => refresh()} >Refresh</Button>]}  >
      { users.error && <p>Error : {users.error}</p> }
      { deletedUser.error && <p>Error : {deletedUser.error}</p> }
      <Table loading={users.loading || deletedUser.loading} dataSource={users.results} columns={columns} /> 
    </Card>
  )
}


const App = () => {
  
  const { Header, Footer, Content } = Layout
	return (
    
      <Layout style={{ minHeight: '100vh'}}>
        <Header style={{ color: 'white'}} >Jsqel demo</Header>
        <Content style={{ padding:'1rem', }} >
          <Row gutter={16}>
            <Col xs={24} md={12} xl={8}> <WrappedUserLoginForm /> </Col>
            <Col xs={24} md={12} xl={8}> <WrappedUserSigninForm /> </Col>
            <Col xs={24} md={12} xl={8}> <Hello /> </Col>
            <Col xs={24} md={12} xl={8}> <PrivateHello /> </Col>
            <Col xs={24} md={12} xl={8}> <Upload /> </Col>
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center'}}>Jsqel react demo - <a href="https://camilab.co">Camilab 2019</a> </Footer>
      </Layout>
    
	)
}

export default withStore({username:''}, reducer)(App)
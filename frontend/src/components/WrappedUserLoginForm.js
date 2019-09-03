import React from 'react'
import {useJsqel} from '../api/jsqel'
import { useStore } from '../store/store'
import {Input, Card, Spin, Form, Button, Icon, message} from 'antd'

const UserLoginForm = ( {form} ) => {
    const {dispatch, state} = useStore()
    const [{results, error, loading}, refresh, clear] = useJsqel('auth/login', { sendItNow:false, username : '', password:''})
    
    const handleLogin = e => {
      e.preventDefault()
      form.validateFields( (err, values) => err ? console.log('Error during field validation') : refresh(values) ) 
      form.resetFields()
    }

    const handleLogout = e => {
      clear() // clear results to prevent auto-login
      dispatch({type:'LOGOUT'}) // Clear token
    }

    if (results && results.token && results.username && results.username !== state.username ) {
      dispatch({type:'LOGIN',username:results.username, token:results.token}) // Sync store with results
    }

    const { getFieldDecorator } = form

    if (error) {
      message.error(error)
      clear()
    }

    if (state.username) { 
      return (
        <Card title={'logged as '+ state.username} className="card">
          <Button onClick={handleLogout} >Log out</Button>
        </Card>
          
      )
    }
    
    return (
      <Card title="Login form" className="card">
        <Form onSubmit={handleLogin} >
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }, {min:4, message:'At least 4 chars'}],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }, {min:4, message:'At least 4 chars'}],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Button type="primary" loading={loading} htmlType="submit" >
                Log in
            </Button>
  
        </Form>
        <p>To log in as admin : Admin/pwdpwd</p>
        
      </Card>
    )
  
  }

const WrappedUserLoginForm = Form.create({ name: 'login' })(UserLoginForm)

export default WrappedUserLoginForm


  
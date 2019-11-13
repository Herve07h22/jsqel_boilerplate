import React from 'react'
import { withRouter } from "react-router-dom";
import {useJsqel} from '../../api/jsqel'
import { useStore } from '../../store/store'
import {Input, Card, Form, Button, Icon, message} from 'antd'

const centeredContainer = {
  maxWidth:'500px',
  minHeight:'100vh',
  display:'flex',
  margin:'auto',
}

const UserLoginForm = ( {form, history} ) => {
    const {dispatch} = useStore()
    
    const next = location => location && location.search && location.search.length && location.search.startsWith('?next=') ? location.search.slice(6) : ''

    const afterLogin = ({results, error}) => {
      if (results && results.token && results.role) {
          dispatch( { type:"LOGIN", ...results })
          message.success('Welcome !')
          console.log("Next :", next(history.location))
          history.push('/'+next(history.location))
      } else {
          message.error('Informations de connexions non valides')
          clear()
      }
    }
    
    const [{loading}, refresh, clear] = useJsqel('auth/login', { sendItNow:false, username : '', password:'', callback:afterLogin})

    const handleLogin = e => {
      e.preventDefault()
      form.validateFields( (err, values) => err ? console.log('Error during field validation') : refresh(values) ) 
      form.resetFields()
    }

    const { getFieldDecorator } = form

    return (
      <div style={centeredContainer}>
        <Card title="Login form" className="card" loading={loading}>
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
      </div>
    )
  
  }

const WrappedUserLoginForm = Form.create({ name: 'login' })(UserLoginForm)

export default withRouter(WrappedUserLoginForm)


  
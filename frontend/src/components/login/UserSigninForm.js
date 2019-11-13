import React from 'react'
import {useJsqel} from '../../api/jsqel'
import {Input, Card, Form, Button, Icon, message} from 'antd'

const UserSigninForm = ( {form} ) => {
    const [{ error, loading}, refresh, clear] = useJsqel('auth/signin', { sendItNow:false, username : '', password:''})
    const handleSubmit = e => {
      e.preventDefault()
      form.validateFields( (err, values) => err ? console.log('Error during field validation') : refresh(values) )
    }
    const { getFieldDecorator } = form

    if (error) {
      message.error(error)
      clear()
    }
    
    return (
      <Card title="Signin form" className="card">
        <Form onSubmit={handleSubmit} >
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
                Sign in
            </Button>
  
        </Form>
  
      </Card>
    )
  
  }
  
const WrappedUserSigninForm = Form.create({ name: 'signin' })(UserSigninForm)

export default WrappedUserSigninForm


  
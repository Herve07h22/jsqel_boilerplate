import React from 'react'
import {useJsqel} from '../jsqel'
import {Input, Card, Spin, Form, Button, Icon, Select} from 'antd'

const UserSigninForm = ( {form} ) => {
    const [{results, error, loading}, refresh] = useJsqel('http://localhost:5000/', 'signin', { sendItNow:false, username : '', password:''})
    const handleSubmit = e => {
      e.preventDefault()
      form.validateFields( (err, values) => err ? console.log('Error during field validation') : refresh(values) )
    }
    const { getFieldDecorator } = form
    const { Option } = Select;
    
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
            <Form.Item>
              {getFieldDecorator('role', {
                rules: [{ required: true, message: 'Please input your Password!' }, {min:4, message:'At least 4 chars'}],
              })(
                <Select
                  showSearch
                  placeholder="Select a role"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
                >
                  <Option value="Admin">Admin</Option>
                  <Option value="Member">Member</Option>
                </Select>,
              )}
            </Form.Item>
            <Button type="primary" htmlType="submit" >
                Sign in
            </Button>
  
        </Form>
        { error && <p>Error : {error}</p> }
        { loading ? <Spin /> : results.map( row => <p>row.message</p>)  }
  
      </Card>
    )
  
  }
  
const WrappedUserSigninForm = Form.create({ name: 'signin' })(UserSigninForm)

export default WrappedUserSigninForm


  
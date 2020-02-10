import React from 'react'
import {Form, InputNumber, Input, Button } from 'antd'

const InputElement = ({type, ...rest}) => {
    switch(type) {
        case 'integer'  : return <InputNumber {...rest} />
        case 'password' : return <Input.Password {...rest} />
        default         : return <Input {...rest} />
    }
}

const FormElement = ({name, label, type, form}) => (
    <Form.Item label={label} hasFeedback>
        {form.getFieldDecorator(name, {
        rules: [
            {
            required: true,
            message: 'Please input your password!',
            },
            {
            validator: this.validateToNextPassword,
            },
        ],
        })(<InputElement type={type} />)}
    </Form.Item>
)

const CreateEdit = ({onSave,fields, form}) => {

    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            } else {

            }
        })
    }

    return (
        <Form onSubmit={handleSubmit}> 
            {fields.map(field => <FormElement form={form} {...field} /> ) }
            <Form.Item >
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
        </Form>
    )

}

export default Form.create()(CreateEdit);

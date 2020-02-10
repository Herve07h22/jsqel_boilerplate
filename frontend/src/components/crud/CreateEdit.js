import React from 'react'
import {Form, InputNumber, Input, Button, message, Select  } from 'antd'

const InputElement = ({type, ...rest}) => {
    if (Array.isArray(type)) {
        return (
        <Select >
            { type.map(option => <Select.Option value={option.id}>{option.value}</Select.Option>)} 
        </Select>
        )
    }

    if (typeof type) {

    }

    switch(type) {
        case 'integer'  : return <InputNumber {...rest} />
        case 'password' : return <Input.Password {...rest} />
        default         : return <Input {...rest} />
    }
}

const FormElement = ({name, label, type, validation=[], form}) => (
    <Form.Item label={label} hasFeedback>
        {form.getFieldDecorator(name, {
        rules: validation.map( v => ({validator:v.rule, message:v.message})),
        })(<InputElement type={type} />)}
    </Form.Item>
)

const CreateEdit = ({onSave,fields, form}) => {

    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onSave(values)
            } else {
                message.error(err)
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

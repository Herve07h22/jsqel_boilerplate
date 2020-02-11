import React from 'react'
import moment from 'moment'
import {Form, InputNumber, Input, Button, message, Select, DatePicker } from 'antd'
import {useJsqel} from '../../api/jsqel'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
}

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
        span: 24,
        offset: 0,
        },
        sm: {
        span: 16,
        offset: 6,
        },
    },
}

const InputElement = ({type, readonly, api, ...rest}) => {
    const [listItem, ]   = useJsqel(`${api}/list`, { sendItNow:(typeof type === "object"), table:type.ressource})
    if (Array.isArray(type)) {
        return (
        <Select {...rest}>
            { type.map(option => <Select.Option key={option.id} value={option.id}>{option.value}</Select.Option>)} 
        </Select>
        )
    }

    if (typeof type === "object") {
        return (
            <Select {...rest}>
                { listItem && listItem.results && listItem.results.map(item => <Select.Option key={item.id} value={item.id}>{item[type.field]}</Select.Option>)} 
            </Select>
            )
    }

    switch(type) {
        case 'date'     : return <DatePicker {...rest} />
        case 'integer'  : return <InputNumber  {...rest} />
        case 'password' : return <Input.Password  {...rest} />
        default         : return <Input   {...rest} />
    }
}

const FormElement = ({name, label, type, validation=[], currentValue, readonly, api, form}) => (
    <Form.Item label={label} hasFeedback={!readonly}>
        {form.getFieldDecorator(name, {
        rules: validation.map( v => ({validator:v.rule, message:v.message})),
        initialValue:type === "date" ? moment(currentValue) : currentValue
        })(<InputElement type={type} disabled={readonly} api={api}/>)}
    </Form.Item>
)

const CreateEdit = ({onSave,fields, currentItem, api, loading, form}) => {
    
    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onSave({...values, id:currentItem.id})
            } else {
                message.error(err)
            }
        })
    }

    return (
        <Form {...formItemLayout} onSubmit={handleSubmit}> 
            {fields.map(field => <FormElement key={field.name} api={api} form={form} currentValue={currentItem[field.name]} {...field} /> ) }
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Save
                </Button>
                &nbsp;
                <Button type="secondary" onClick={()=>onSave(null)} >
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    )

}

export default Form.create()(CreateEdit);

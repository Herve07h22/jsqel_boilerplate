import React from "react";
import { Form, InputNumber, Input, Button, Select, DatePicker, Switch } from "antd";
import { useJsqel } from "../../api/jsqel";
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
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
};
const InputElement = ({ type, readonly, api, ...rest }) => {
  const apiToUse = typeof type === "object" && type.api ? type.api : api;
  const [listItem] = useJsqel(`${apiToUse}/list`, { sendItNow: typeof type === "object", table: type.ressource });
  if (Array.isArray(type)) {
    return (
      <Select {...rest}>
        {type.map((option) => (
          <Select.Option key={option.id} value={option.id}>
            {option.value}
          </Select.Option>
        ))}
      </Select>
    );
  }
  if (typeof type === "object") {
    return (
      <Select {...rest}>
        {listItem &&
          listItem.results &&
          listItem.results.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item[type.field]}
            </Select.Option>
          ))}
      </Select>
    );
  }
  switch (type) {
    case "date":
      return <DatePicker {...rest} />;
    case "integer":
      return <InputNumber {...rest} />;
    case "password":
      return <Input.Password {...rest} />;
    case "boolean":
      return <Switch {...rest} />;
    default:
      return <Input {...rest} />;
  }
};
const FormElement = ({ name, label, type, validation = [], readonly, api, form }) => (
  <Form.Item
    label={label}
    hasFeedback={!readonly && type !== "boolean"}
    name={name}
    rules={validation.map((v) => ({ validator: v.rule, message: v.message }))}
    valuePropName={type === "boolean" ? "checked" : "value"}
  >
    <InputElement type={type} disabled={readonly} api={api} />
  </Form.Item>
);
const CreateEdit = ({ onSave, fields, currentItem, api, loading, onValuesChange }) => {
  const [form] = Form.useForm();
  const onFinish = (values) => onSave({ ...values, id: currentItem.id });
  return (
    <Form
      {...formItemLayout}
      onFinish={onFinish}
      onValuesChange={(changedValues, allValues) => onValuesChange && onValuesChange(form, changedValues, allValues)}
      initialValues={currentItem}
      form={form}
    >
      {fields.map((field) => (
        <FormElement key={field.name} api={api} form={form} {...field} />
      ))}
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
        &nbsp;
        <Button type="secondary" onClick={() => onSave(null)}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};
export default CreateEdit;

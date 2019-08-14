import React from 'react'
import {Card, Form, Button, Icon, Upload} from 'antd'

const UploadForm = ({form}) => {

    const { getFieldDecorator } = form

    const normFile = e => {
        console.log('Upload event:', e)
        return e 
    }

    const handleLogin = values => console.log("Form values : ", values)

    return (
        <Card title="Upload form" className="card">
            <Form onSubmit={handleLogin} >

                <Form.Item label="File" extra="Please upload your file">
                    {getFieldDecorator('upload', {
                        //valuePropName: 'file',
                        getValueFromEvent: normFile,
                    })(
                        <Upload name="myFile" action="http://localhost:5000/direct/upload" listType="text" multiple={false}>
                            <Button>
                                <Icon type="upload" /> Télécharger
                            </Button>
                        </Upload>,
                    )}
                </Form.Item>


            </Form>
        </Card>
    )
}

const WrappedUploadForm = Form.create({ name: 'upload' })(UploadForm)

export default WrappedUploadForm



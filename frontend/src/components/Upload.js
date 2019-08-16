import React from 'react'
import {Card, Form, Button, Icon, Upload} from 'antd'

const UploadForm = ({form}) => {

    const { getFieldDecorator } = form

    const normFile = e => {
        console.log('Upload event:', e);
        if (e.file && e.file.response) return e.file.response.filename
        return ""
    }

    const token = window.localStorage.getItem('jsqel_token')
    const headers = { Authorization: `Bearer ${token}` }
    const api_url = process.env.NODE_ENV === 'production' ? 'http://localhost/api/' : 'http://localhost:5000/'

    const handleLogin = values => console.log("Form values : ", values)

    return (
        <Card title="Upload form (Admin login required!)" className="card">
            <Form onSubmit={handleLogin} >

                <Form.Item label="File" extra="Please upload your file">
                    {getFieldDecorator('upload', {
                        getValueFromEvent: normFile,
                    })(
                        <Upload name="myFile" action={api_url+"direct/upload"} headers={headers} listType="text" multiple={false}>
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



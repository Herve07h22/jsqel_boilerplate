import React from 'react'
import { useStore } from '../../store/store'
import { useJsqel } from '../../api/jsqel'
import {Row, Col, Button} from 'antd'

const headerStyleLogo = {
    color:'white',
    mawWidth:'200px',
    paddingLeft:'1rem',
}

const headerStyleUser = {
    color:'white',
    padding:'1rem',
}

const HeaderContent = () => {

    useJsqel('auth/islogged', { sendItNow:true, callback: ({results}) => dispatch({type:'UPDATE', payload:results[0]})})
    const {state , dispatch} = useStore()

    const handleLogout = e => dispatch({type:'LOGOUT'}) // Clear token
    
    return (
        <Row align="middle" type="flex" justify="space-between"  >
            <Col span={4}><h1 style={headerStyleLogo}>JSqel Demo</h1></Col>
            
            <Col span={4}>
                <span style={headerStyleUser}> {state.username} </span>
                <Button onClick={handleLogout} >Log out</Button>
            </Col>
        </Row>
    )
    
}

export default HeaderContent

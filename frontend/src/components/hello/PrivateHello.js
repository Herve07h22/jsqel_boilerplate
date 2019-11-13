import React from 'react'
import {useJsqel} from '../../api/jsqel'
import { useStore } from '../../store/store'
import {Input, Card, Spin } from 'antd'

const PrivateHello = () => {
    const {state} = useStore()
    console.log(" PrivateHello state :", state)
    const { Search } = Input
    const [{results, error, loading}, refresh] = useJsqel('test/private_hello', { sendItNow:false, filter : '' })
    return (
      <Card title="Private Hello API" className="card">
        <Search placeholder='Your filter here. Ex : H%' onSearch={filter => refresh({filter})} enterButton />
        { error && <p>Error : {error}</p> }
        { loading ? <Spin /> : results.map( row => <p key={row.id} >{row.message}</p>)  }
        { state && state.username ? <p>{state.username} is logged : the query can be run</p> : <p>This query cannot be run</p>}
      </Card>
    )
  }

  export default PrivateHello


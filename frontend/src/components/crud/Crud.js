import React, {useState} from 'react'
import {useJsqel} from '../../api/jsqel'
import {Table, Card, Popconfirm, Button } from 'antd'
import CreateEdit from './CreateEdit'

/* ******************************************************
*
* Crud Component
*
* Render a cards with built-in CRUD features
* props :
* - api        : string | Main base endpoint. Endpoints list new update and delete should be defined
* - ressource  : string | Table name  
* - itemByPage : integer| number of items displayed in 1 page (default 10)
* - uploadCSV  : string | if not empty, add a CSV import button with this label
* - exportCSV  : string | if not empty, add a CSV export button with this label
* - filter     : object | object injected in the parameters of the query
* - title      : string | title of the card
* - fields     : array of objects | fields displayed in the form. Should be like that :
*   {   name:"<name of the field that shoul match the database name>" , 
*       label:"<Explicit name for user>" ,
*       position : "primary" or "secondary". If primary, appears a a column in the list. Else, appears in dropdown
*       type : "integer", "string", choice([{id:1, "choice1"}, {id:2, value:"choice2"}]), select({api:"xxxx", field:"<name of the field>"})
*       validation : array of objects. { rule:value=>boolean (true if OK), message:"Message if validation fails" }
*    }
*
* ******************************************************/ 


const Crud = ({api, ressource, itemByPage=10, uploadCSV="", exportCSV="", filter={}, title="Title of this form", fields=[]}) => {
    const [listItem, refreshListItem]   = useJsqel(`${api}/list`, { sendItNow:true, table:ressource, ...filter})
    const userFeedback = message => ({error}) => {
        if (error) {
            message.error(error)
        } else {
            message.success(error)
            refreshListItem()
        }
    }
    const [deletedItem, deleteItem ]    = useJsqel(`${api}/delete`, { sendItNow:false, table:ressource, callback: userFeedback })
    const [createdItem, createItem ]    = useJsqel(`${api}/create`, { sendItNow:false, table:ressource, callback: userFeedback })
    const [updatedItem, updateItem ]    = useJsqel(`${api}/update`, { sendItNow:false, table:ressource, callback: userFeedback })
    const saveItem                      = item => item.id ? updateItem(item) : createItem(item)

    const [currentItem, setCurrentItem ]= useState(null)

    const columnsList = fields.filter(field => field.position==="primary").map( field => ({title:field.label, dataIndex:field.name}))
    const columnsListAndActions = [ ...columnsList, 
                                    {
                                        title:'Edit', 
                                        render: (text, record) => <Button type="primary" onClick={()=>setCurrentItem(record)}>Edit</Button>
                                    } ,
                                    {
                                        title:'Delete', 
                                        render: (text, record) => (
                                            <Popconfirm title="Sure to delete?" onConfirm={() => { deleteItem({id:record.id}); }} >
                                            <Button type="primary">Delete</Button>
                                            </Popconfirm>
                                        ),
                                    } ,
                                ]
    
    const loading = listItem.loading || deletedItem.loading

    if (currentItem !== null) return <CreateEdit onSave={saveItem} fields={fields} />

    return (
        <Card title={title} actions={[<Button onClick={e => setCurrentItem({}) }>New item</Button>]}  >
            { listItem.error && <p>Error : {listItem.error}</p> }
            { deletedItem.error && <p>Error : {deletedItem.error}</p> }
            <Table loading={loading} dataSource={listItem.results} columns={columnsListAndActions} rowKey={r=>r.id}/> 
        </Card>
    )
    
}

const choice = ({id, value}) => ({id, value})

export {Crud, choice}



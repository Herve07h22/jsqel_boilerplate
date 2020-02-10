
const checkTableName = message => value => value && ['opportunities', 'leads', 'opportunites_comments'].includes(value) ? ({success: true, value}) : ({success: false, message: message })
const checkValidInterger = message => value => !isNaN(value) ? ({success: true, value}) : ({success: false, message: message })

const listItem = {
    name : 'list',
    sql : 'SELECT * FROM ${table:name};',
    restricted : ['Admin', 'Member'],
    params : {
        table : checkTableName("Invalid ressource name"),
    },    
}

const deleteItem = {
    name : 'delete',
    sql : 'DELETE FROM ${table:name} WHERE id=${id} RETURNING *;',
    restricted : ['Admin','Member'],    
    params : {
        id : checkValidInterger("Invalid opportunites id"),
        table  : checkTableName("Invalid ressource name"),
    },
}

const updateItem = {
    name : 'update',
    sql : 'UPDATE ${table:name} SET ( ${names:csv} ) = ( ${values:csv} ) WHERE id=${id} RETURNING *;',
    restricted : ['Admin','Member'],    
    params : {
        id : checkValidInterger("Invalid opportunites id"),
        table  : checkTableName("Invalid ressource name"),
        data    : value => value ? ({success: true, value}) : ({success: false, message: "data should be a valid object" }),
    },
    beforeQuery : (query, params ) => Object.assign( {}, params, {names:Object.keys(params.data)}, {values:Object.keys(params.data).map(k => params.data[k] )} ),
}

const createItem = {
    name : 'create',
    sql : 'INSERT INTO ${table:name} ( ${names:csv} ) VALUES ( ${values:csv} ) RETURNING *;',
    restricted : ['Admin','Member'],    
    params : {
        table  : checkTableName("Invalid ressource name"),
        data    : value => value ? ({success: true, value}) : ({success: false, message: "data should be a valid object" }),
    },
    beforeQuery : (query, params ) => Object.assign( {}, params, {names:Object.keys(params.data)}, {values:Object.keys(params.data).map(k => params.data[k] )} ),
}

module.exports = { queries : [listItem, deleteItem, updateItem, createItem ]}
// The major difference between require and import, is that require will automatically scan node_modules to find modules, but import, which comes from ES6, won't.
// const jsqel = require('jsquel/backend')
const jsqel = require('jsqel')
const uuidv4 = require('uuid/v4')

const dbUri = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URI : 'sqlite://jsqel.db'

const app = jsqel({  dbUri ,
                    secret  : 'anysecretkeyyouwant',
                    debug  : process.env.NODE_ENV !== 'production' ,
                    apiUrlBase : process.env.NODE_ENV === 'production' ? '/api' : '',
                })

console.log("Running mode is :", process.env.NODE_ENV)
console.log("Database URI is :", dbUri)
console.log("Database URI received from env is :", process.env.DATABASE_URI)

// Use built-in modules
const auth = require('jsqel/modules/auth')
const ra = require('jsqel/modules/admin')
const upload = require('jsqel/modules/upload')

// One endpoint = One parametrized query
const hello = {
    name : 'hello',
    sql : 'SELECT * FROM Users',
    restricted : ['Public'],
    beforeQuery : (query, params) => { console.log("this", this); return {} }
}
 
const private_hello = {
    name : 'private_hello',
    sql : "SELECT * FROM Hello where message like ${filter}", // Auto inject user_id and role
    restricted : ['Member', 'Admin'], // private query, request need authentication bearer
    params : {
        filter  : value => ({success: true, value }) ,
        user_id : value => ({success: true, value }) ,  // Injected parameter for an authenticated query (which does not contains 'Public' in restricted)
        role    : value => ({success: true, value }) ,  // Injected parameter for an authenticated query (which does not contains 'Public' in restricted)
    },
    beforeQuery : (query, params) => { console.log('Filter : ', params.filter); return params; },
    afterQuery  : (query, params, results) => { console.log("Got the result !"); return results; }, 
}

const whoami = {
    name : 'whoami',
    sql : "SELECT * FROM Users where id=${user_id}", // Auto inject user_id and role
    restricted : ['Member', 'Admin'], // private query, request need authentication bearer
    params : {
        user_id : value => ({success: true, value }) ,  // Injected parameter for an authenticated query (which does not contains 'Public' in restricted)
    },
}
// Register a list of endpoints
app.register("test", [hello, private_hello, whoami])

// SQL Queries executed each time the server is restarted
const migrationBatch = async () => {
    
    // Migrate & register built-in modules
    await app.migrateAndRegister("auth", auth)
    await app.migrateAndRegister("admin", ra)
    await app.migrateAndRegister("direct", upload)

    // Add an admin user
    await app.jsqeldb.executeQuery("INSERT INTO users (id, username, password, role_id) VALUES ( ${id}, ${username}, ${password}, 2) ON CONFLICT DO NOTHING;", {id:uuidv4(), username:"Admin", password:app.encrypt("pwdpwd")} )

    // Migrate user-defined modules
    await app.migrate('sql/hello_schema.sql')
    await app.migrate('sql/hello_seeds.sql')
}
// Launch migrations, then launch server 
migrationBatch()
.then(()=>app.run())
.catch(e => console.log('Something went wrong during migration : ', e))

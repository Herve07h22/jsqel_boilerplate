const sqlite3 = require('sqlite3').verbose()
sqliteConnexion = new sqlite3.Database(':memory:')

sqliteConnexion.exec('CREATE TABLE Roles ( id int PRIMARY KEY, name varchar(255) NOT NULL )')
sqliteConnexion.exec("INSERT INTO Roles VALUES (1, 'Member'); INSERT INTO Roles VALUES (2, 'Admin');")
sqliteConnexion.exec('CREATE TABLE Users (id INTEGER PRIMARY KEY, username varchar(255) NOT NULL,password varchar(255) NOT NULL,role_id int );')

var parameter1 = { $username : 'John', $password : '' }
var parameter2 = { username: 'Steeve', password:'d5de9fde48fd7064e632a90efda37111de8a911080eeaf40b202bdde0e7dcad0' }
var parameter3 = Object.entries(parameter2).reduce((acc, val) => Object.assign(acc, { ['$'+val[0]]: val[1] }), {} )

sqliteConnexion.all('INSERT INTO Users (username, password, role_id) VALUES ($username, $password, 1)', parameter1, (err,rows) => err ? console.log(err) : console.log(rows) )
.all('INSERT INTO Users (username, password, role_id) VALUES ($username, $password, 1)', parameter3, (err,rows) => err ? console.log(err) : console.log(rows) )

var parameter4 = { username: 'Steeve', password:'d5de9fde48fd7064e632a90efda37111de8a911080eeaf40b202bdde0e7dcad0' }
var parameter5 = Object.entries(parameter4).reduce((acc, val) => Object.assign(acc, { ['$'+val[0]]: val[1] }), {} )

setTimeout( () =>  sqliteConnexion.all('SELECT Users.id as id, Users.username as username, Roles.name as role FROM Users, Roles where username=$username and password=$password and Users.role_id = Roles.id', parameter5, (err,rows) => err ? console.log(err) : console.log(rows) ), 1000)

setTimeout( () =>  sqliteConnexion.close(), 2000)






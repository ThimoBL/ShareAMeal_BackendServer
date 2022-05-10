const mysql = require('mysql')
require('dotenv').config()

const pool = mysql.createPool({
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    multipleStatements: true,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})
//
// pool.on('acquire', function (connection) {
//     console.log('Connection %d acquired', connection.threadId)
// })
//
// pool.on('release', function (connection) {
//     console.log('Connection %d released', connection.threadId)
// })

module.exports = pool
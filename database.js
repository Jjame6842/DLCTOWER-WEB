const mysql = require('mysql2')

const connection = mysql.createConnection({
    host :'localhost',
    user:'root',
    password:'',
    database:'user_info'
})

module.exports = connection();
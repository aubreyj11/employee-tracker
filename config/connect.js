const mysql = require('mysql2');
require('dotenv').config();

// console.log(process.env);

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.PORT || 3306,
    user: 'root',
    password: process.env.myPassword,
    database: 'employees_db'
},
console.log('Connected to Database')
);

module.exports = connection; 

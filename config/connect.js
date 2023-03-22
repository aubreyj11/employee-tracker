const mysql = require('mysql2');
require('dotenv').config();

// console.log(process.env);

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.PORT || 3001,
    user: 'root',
    password: process.env.myPassword,
    database: 'employees'
},
console.log('Connected to Database')
);

module.exports = connection; 

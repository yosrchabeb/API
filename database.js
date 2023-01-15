var mysql = require('mysql');
var pool = mysql.createPool({
    port:3306,
    host: "localhost",
    user: "root",
    password :"",
    database: "project"
});    
module.exports = pool;

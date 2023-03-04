const mysql2 = require('mysql2');

//create connection
const connection=mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'library'
});

module.exports=connection;

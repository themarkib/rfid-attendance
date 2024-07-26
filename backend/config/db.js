// database.js
const mysql = require('mysql');

// MySQL Connection Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'rfid_mysql' // Replace with your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;

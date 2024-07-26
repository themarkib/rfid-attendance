// database.js
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

// MySQL Connection Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'rfid_mysql' // Replace with your MySQL database name
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to the MySQL database');

  const username = 'adminuser';
  const password = 'adminpassword'; // Plain text password

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;

    const query = 'INSERT INTO admin (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, results) => {
      if (err) throw err;
      console.log('Admin user added:', results);
      db.end();
    });
  });
});

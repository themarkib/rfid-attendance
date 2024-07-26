const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

let latestUID = ''; // Variable to store the latest UID
let latestTimestamp = ''; // Variable to store the latest timestamp

// Middleware to parse URL-encoded bodies (for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Middleware to parse JSON bodies (for POST requests)

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


const SECRET_KEY = 'bikram'; // Replace with your actual secret key

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Query to find user by username
  db.query('SELECT * FROM admin WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];

    // Compare password with hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords' });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      console.log(token);

      // Successful login
      res.json({ token });
    });
  });
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Serve static files from the 'public' folder
// app.use(express.static(path.join(__dirname, 'public')));


// Endpoint to fetch attendance data
app.get('/attendance', (req, res) => {
  const query = 'SELECT id, name, card_id, date, time_in, time_out FROM attendance_log';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
      return;
    }
    res.json(results);
  });
});

// Endpoint to fetch user data
app.get('/users', (req, res) => {
  const query = 'SELECT  userid,card_id,name,phone FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
      return;
    }
    res.json(results);
  });
});


// POST endpoint to add user
app.post('/api/add-user', (req, res) => {
  const { cardid, name, email, phoneNo } = req.body;

  const query = 'INSERT INTO users (card_id, name, email, phone) VALUES (?, ?, ?, ?)';
  const values = [cardid, name, email, phoneNo];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Failed to add user.' });
    }
    res.status(200).json({ message: 'User added successfully!' });
  });
});

// GET endpoint to fetch users
app.get('/api/users', (req, res) => {
  const query = 'SELECT userid, card_id, name, phone FROM users';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ message: 'Failed to fetch users.' });
    }
    res.status(200).json(results);
  });
});

// DELETE endpoint to remove a user
app.delete('/api/users/:idno', (req, res) => {
  const { idno } = req.params;

  const query = 'DELETE FROM users WHERE userid = ?';
  
  db.query(query, [idno], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Failed to delete user.' });
    }
    res.status(200).json({ message: 'User deleted successfully!' });
  });
});


// PUT endpoint to update user
app.put('/api/users/:idno', (req, res) => {
  const { idno } = req.params;
  const { cardid, name, contactno } = req.body;

  const query = `
    UPDATE users
    SET card_id = ?, name = ?, phone = ?
    WHERE userid = ?
  `;

  db.query(query, [cardid, name, contactno, idno], (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Failed to update user.' });
    }
    res.status(200).json({ message: 'User updated successfully!' });
  });
});


// Endpoint to get the latest UID
app.get('/latest-uid', (req, res) => {
  res.json({ uid: latestUID, timestamp: latestTimestamp });
});

// Endpoint to fetch user data based on UID
app.get('/project/backend/uid', (req, res) => {
  const uid = req.query.uid;
  console.log(uid);

  if (!uid) {
    console.log("No UID provided");
    return res.status(400).json({ error: 'UID not provided' });
  }

  // Query MySQL database to fetch user data based on UID
  const sql = 'SELECT * FROM users WHERE uid = ?';
  db.query(sql, [uid], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Error fetching user data' });
    }

    if (results.length === 0) {
      console.log(`No user found with UID ${uid}`);
      return res.status(404).json({ error: `No user found with UID ${uid}` });
    }

    const user = results[0]; // Assuming UID is unique, so there should be only one result

    // Check if an attendance entry already exists for today
    const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const checkLogSql = 'SELECT * FROM attendance_log WHERE card_id = ? AND date = ?';
    
    db.query(checkLogSql, [uid, currentDate], (err, logResults) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Error checking attendance log' });
      }

      if (logResults.length > 0) {
        // Attendance entry exists for today
        const logEntry = logResults[0];
        if (logEntry.time_in && !logEntry.time_out) {
          // If time_in is present and time_out is not, update time_out
          const updateLogSql = 'UPDATE attendance_log SET time_out = ? WHERE id = ?';
          const currentTime = new Date().toISOString().slice(11, 19); // HH:MM:SS

          db.query(updateLogSql, [currentTime, logEntry.id], (err, updateResults) => {
            if (err) {
              console.error('Error executing MySQL query:', err);
              return res.status(500).json({ error: 'Error updating attendance log' });
            }

            res.json(user); // Send user data as JSON response
          });
        } else {
          // Attendance already logged or time_out is set
          res.json({ message: 'Attendance already logged for today' });
        }
      } else {
        // No attendance entry exists for today, insert a new one
        const logSql = `
          INSERT INTO attendance_log (card_id, name, date, time_in) 
          VALUES (?, ?, ?, ?)
        `;
        const currentTime = new Date().toISOString().slice(11, 19); // HH:MM:SS

        db.query(logSql, [uid, user.name, currentDate, currentTime], (err, logResults) => {
          if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'Error logging attendance' });
          }

          res.json(user); // Send user data as JSON response
        });
      }
    });
  });
});

// Endpoint to simulate receiving a new UID (for testing purposes)
app.post('/project/backend/uid', (req, res) => {
  latestUID = req.body.UIDresult;
  latestTimestamp = new Date().toLocaleString();
  res.sendStatus(200);
});

// Endpoint to add a new user if the UID does not exist
app.post('/project/backend/add-user', (req, res) => {
  const { uid, name, email } = req.body;

  if (!uid || !name || !email) {
    return res.status(400).json({ error: 'UID, name, and email are required' });
  }

  // Check if the UID already exists
  const checkSql = 'SELECT * FROM users WHERE userid = ?';
  db.query(checkSql, [uid], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Error checking UID' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'UID already exists' });
    }

    // Insert new user into the database
    const insertSql = 'INSERT INTO users (uid, name, email) VALUES (?, ?, ?)';
    db.query(insertSql, [uid, name, email], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Error adding user' });
      }

      res.status(200).json({ message: 'User added successfully' });
    });
  });
});

// Handle 404 - Keep this as the last route
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

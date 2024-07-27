const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');

const app = express();
const port = 3000;

let latestUID = ''; // Variable to store the latest UID
let latestTimestamp = ''; // Variable to store the latest timestamp

// Middleware to parse URL-encoded bodies (for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Middleware to parse JSON bodies (for POST requests)

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' folder
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

// Dashboard
app.get('/api/metrics', (req, res) => {
  const queries = {
    totalStudents: 'SELECT COUNT(*) as count FROM users;',
    presentStudents: 'SELECT COUNT(*) as count FROM attendance_log WHERE DATE(date) = CURDATE();'
  };

  const metrics = {};

  const queryKeys = Object.keys(queries);
  let completedQueries = 0;

  queryKeys.forEach(key => {
    db.query(queries[key], (err, result) => {
      if (err) throw err;
      metrics[key] = result[0].count;
      completedQueries++;
      if (completedQueries === queryKeys.length) {
        metrics.absentStudents = metrics.totalStudents - metrics.presentStudents;
        res.send(metrics);
      }
    });
  });
});


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
  const query = 'SELECT  userid,card_id,name,phone,gender,email FROM users';
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
  const { cardid, name, email, phoneNo, gender } = req.body;

  const query = 'INSERT INTO users (card_id, name, email, phone, gender) VALUES (?, ?, ?, ?, ?)';
  const values = [cardid, name, email, phoneNo, gender];

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

  if (!uid) {
    return res.status(400).json({ error: 'UID not provided' });
  }

  // Query MySQL database to fetch user data based on UID
  const sql = 'SELECT * FROM users WHERE card_id = ?';
  db.query(sql, [uid], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Error fetching user data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: `No user found with UID ${uid}` });
    }

    const user = results[0]; // Assuming UID is unique, so there should be only one result

    // Check if an attendance entry already exists for today
    const currentDate = moment().tz('Asia/Kathmandu').format('YYYY-MM-DD'); // Get current date in Nepal Time
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
          const currentTime = moment().tz('Asia/Kathmandu').format('HH:mm:ss'); // Get current time in Nepal Time

          db.query(updateLogSql, [currentTime, logEntry.id], (err) => {
            if (err) {
              console.error('Error executing MySQL query:', err);
              return res.status(500).json({ error: 'Error updating attendance log' });
            }

            // Reset latestUID after processing
            latestUID = '';
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
        const currentTime = moment().tz('Asia/Kathmandu').format('HH:mm:ss'); // Get current time in Nepal Time

        db.query(logSql, [uid, user.name, currentDate, currentTime], (err) => {
          if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'Error logging attendance' });
          }

          // Reset latestUID after processing
          latestUID = '';
          res.json(user); // Send user data as JSON response
        });
      }
    });
  });
});

// Endpoint to simulate receiving a new UID (for testing purposes)
app.post('/project/backend/uid', (req, res) => {
  latestUID = req.body.UIDresult;
  latestTimestamp = moment().tz('Asia/Kathmandu').format('YYYY-MM-DD HH:mm:ss'); // Store timestamp in Nepal Time
  res.sendStatus(200);
});



// Handle 404 - Keep this as the last route
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const path = require('path');
const moment = require('moment-timezone');

const app = express();
const port = 3000;

let latestUID = ''; // Variable to store the latest UID
let latestTimestamp = ''; // Variable to store the latest timestamp

// Middleware to parse URL-encoded bodies (for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Middleware to parse JSON bodies (for POST requests)

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

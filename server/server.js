const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Add this line



const app = express();
const port = 3000;
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travel',
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Perform validation and hashing of password here (for a production scenario)

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [username, email, password], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    } else {
      console.log('User signed up successfully');
      res.json({ success: true });
    }
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Fetch user information from the database based on the provided username
  const query = 'SELECT * FROM users WHERE name = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length === 0) {
        // User not found
        res.status(401).json({ error: 'Invalid credentials' });
      } else {
        // Compare the provided password with the stored hashed password
        const storedPasswordHash = results[0].password;
        
        // Use bcrypt to compare passwords
        // const passwordMatch = await bcrypt.compare(password, storedPasswordHash);

        if (password == storedPasswordHash) {
          // Passwords match, user is authenticated
          console.log('User logged in successfully');
          res.json({ success: true });
        } else {
          // Passwords do not match
          res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    }
  });
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

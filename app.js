const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files like CSS
app.set('view engine', 'ejs');

//  Connect to MongoDB
 mongoose.connect('mongodb+srv://Test1234:Test1234@cluster0.tomuw.mongodb.net/');

// Define user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Routes
// Render login page
app.get('/', (req, res) => {
  res.render('login', { error: null });
});

// Handle login logic
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.render('index', { username });
    } 
    else {
      res.render('login', { error: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.use(express.static('public'));
app.use(express.static('views'));

// Render signup page
app.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// Handle signup logic
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.render('signup', { error: 'Username already exists!' });
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      res.redirect('/');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

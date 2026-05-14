const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);

app.get("/", (req, res) => {
  res.send("Server Running");
});


// Serve static assets if in production
console.log('Current Environment:', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production' || process.env.SERVE_STATIC) {
  const distPath = path.join(__dirname, '../client/dist');
  console.log('Serving static files from:', distPath);

  // Set static folder
  app.use(express.static(distPath));

  // The catch-all route should be the LAST route defined
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(404).send('Frontend build not found. Make sure you ran "npm run build" in the root directory.');
      }
    });
  });
}

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog-app';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));

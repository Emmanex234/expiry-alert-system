const app = require('./app');
const mongoose = require('mongoose');
const path = require('path'); // Add this for path handling
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expiry-alert';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Serve frontend files in production
    if (process.env.NODE_ENV === 'production') {
      // Serve static files from the frontend public directory
      app.use(express.static(path.join(__dirname, 'frontend', 'public')));
      
      // Handle SPA (Single Page Application) routing
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
      });
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Frontend served at: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

//Middleware
app.use(cors());  //cross origin requests
app.use(express.json());  //parsing application json

//Database connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

//Routes
app.use('/api/products', productRoutes);

//Simple root route
app.get('/', (req, res) => {
    res.send('Stock Management Backend Running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
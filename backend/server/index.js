const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;

require('dotenv').config();


// Import routes
const clubsRouter = require('../routes/api/clubsRoutes');
//try with two ..
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.json({ message: "Hello" });
});

// Include route files
const testRoutes = require('../routes/api/testRoutes');
const userRoutes = require('../routes/api/userRoutes');
const openai = require('../routes/api/openai');


// Use routes
app.use('/users', userRoutes);
app.get('/test', testRoutes);
app.use('/api/clubs', clubsRouter);
app.use('/api/openai/', openai)



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

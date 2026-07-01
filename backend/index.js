const express = require('express');
require('dotenv').config();
require('./Models/db');
const cors = require('cors');
const TaskRouter = require('./Routes/TaskRouter');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from the server');
});
app.use('/tasks', TaskRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT=${PORT}`);
});

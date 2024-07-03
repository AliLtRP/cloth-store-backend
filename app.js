const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router/auth.router');
const category = require('./router/category.router');
const { dbConnection } = require('./database');

app.use(cors({
    origin: ['*'],
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use('/', router);
app.use('/category', category);
dbConnection();

app.listen(3000, () => console.log("app is running on port 3000"));
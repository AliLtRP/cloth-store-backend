const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router/router');
const client = require('./database');

app.use(cors({
    origin: ['*'],
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use('/', router);
client.dbConnection();

app.listen(3000, () => console.log("app is running on port 3000"));
const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router/router');

app.use(cors({
    origin: ['*'],
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use('/', router);

app.listen(3000, () => console.log("app is running on port 3000"));


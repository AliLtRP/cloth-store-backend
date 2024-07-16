const express = require('express');
const { register, login, checkUser } = require('../models/auth');
const isAuth = require('../middleware');
const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).send('ok');
});

router.post('/register', register);
router.post('/login', login);
router.get('/check', isAuth, checkUser);


module.exports = router;
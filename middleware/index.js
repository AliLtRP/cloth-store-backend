const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const isAuth = async (req, res, next) => {
    const token = req.headers['authorization']

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).send('Unauthorized!');
            return;
        }

        next();
    });
}

module.exports = isAuth
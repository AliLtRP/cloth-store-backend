const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require('../database');

async function register(req, res) {
    const { phone, email, avatar, username, password, active } = req.body

    console.log(phone, email, avatar, username, password, active);
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO "user" (phone, email, avatar, username, password, active)
                   VALUES ('${phone}','${email}', '${avatar}', '${username}', '${hashedPassword}', '${active}') RETURNING *`;

    const result = await client.query(query);

    if (result) {
        return res.status(200).send(result);
    }

    return res.status(400).send(result);
}


module.exports = { register };
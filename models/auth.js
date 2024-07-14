const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require('../database');

async function register(req, res) {
    const { phone, email, avatar, username, password, active } = req.body

    console.log(phone, email, avatar, username, password, active);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO "user" (phone, email, avatar, username, password, active)
                       VALUES ('${phone}','${email}', '${avatar}', '${username}', '${hashedPassword}', '${active}') RETURNING *`;

        const result = await client.query(query);

        return res.status(200).send(result.rows[0]);
    } catch (e) {
        return res.status(400).send(e.message);
    }
}

async function login(req, res) {
    const { username_or_email, password } = req.body;

    console.log(username_or_email, password);

    try {
        const query = `SELECT * FROM "user" WHERE username = $1 OR email= $1`;
        const result = await client.query(query, [username_or_email]);

        if (result.rows.length === 0) {
            return res.status(400).send("User was not found");
        }

        const user = result.rows[0];

        console.log(user);
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).send("Invalid Password");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).send({ success: true, token });
    } catch (e) {
        console.log(e);
        return res.status(400).send(e);
    }
}


module.exports = { register, login };
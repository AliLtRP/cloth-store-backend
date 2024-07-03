const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require('../database');

async function login(req,res){
    const {username,password} = req.body;

    console.log(username,password);

    try {
        const query = `SELECT * FROM "user" WHERE username = '${username}'`;
        const result = await client.query(query);

        if(result.rows.length===0){
            return res.status(400).send("User was not found");
        }

        const user = result.rows[0];

        const match = await bcrypt.compare(password,user.password);

        if(!match){
            return res.status(400).send("Invalid Password");
        }
        // using JWT which are json web tokens to authorize users

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY, 
            { expiresIn: '1h' } 
        );

        return res.status(200).send({ token });
    } catch (e) {
        return res.status(400).send(e.message);
    }
}

module.exports = { login };

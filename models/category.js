const jwt = require("jsonwebtoken");
const { client } = require('../database');


async function createCategory(req, res) {
    const { name, img, priority, active } = req.body;

    console.log(name, img, priority, active);

    try {
        const query = `INSERT INTO "category" (name, img, priority, active) 
                       VALUES ('${name}', '${img}', '${priority}', '${active}')`;


        const result = await client.query(query);

        res.send({
            status: 200,
            date: result.rows[0]
        });

    } catch (e) {
        res.status(501).send({
            success: false,
            error: e
        });
    }

}

async function getCategory(req, res) {

}

async function getAllCategory(req, res) {

}

async function updateCategory(req, res) {

}

async function deleteCategory(req, res) {

}

module.exports = { createCategory, getCategory, getAllCategory, updateCategory, deleteCategory }
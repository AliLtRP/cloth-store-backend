const { client } = require('../database');


async function createCategory(req, res) {
    const { name, img, priority, active } = req.body;

    console.log(name, img, priority, active);

    try {
        const query = `INSERT INTO "category" (name, img, priority, active) 
                       VALUES ('${name}', '${img}', '${priority}', '${active}')`;


        const result = await client.query(query);

        return res.send({
            status: 200,
            date: result.rows[0]
        });

    } catch (e) {
        return res.status(501).send({
            success: false,
            error: e
        });
    }

}

async function getCategory(req, res) {
    const { id } = req.query

    try {
        const query = ` SELECT * FROM "category" WHERE id=$1;`;

        const value = [id];

        const result = await client.query(query, value);

        return res.status(200).send({
            success: true,
            data: result.rows[0]
        });
    } catch (e) {
        return res.status(501).send({
            success: false,
            error: e
        });
    }
}

async function getAllCategory(req, res) {
    try {
        const query = ` SELECT * FROM "category"`;

        const result = await client.query(query);

        return res.status(200).send({
            success: true,
            data: result.rows
        });
    } catch (e) {
        return res.status(501).send({
            success: false,
            error: e
        });
    }
}

async function updateCategory(req, res) {
    const { id, name, img, priority, active } = req.body;

    try {
        const query = `UPDATE "category"
        SET name=$1, img=$2, priority=$3, active=$4
        WHERE id=${id}`;

        const value = [name, img, priority, active];

        const result = await client.query(query, value);

        return res.status(200).send({
            success: true,
            data: result.rows[0]
        });
    } catch (e) {
        return res.status(501).send({
            success: false,
            error: e
        });
    }
}

async function deleteCategory(req, res) {
    const { id, status } = req.body;

    try {
        const query = `UPDATE "category"
        SET active=$1
        WHERE id=${id}`;

        const value = [status];

        const result = await client.query(query, value);

        return res.status(200).send({
            success: true,
            data: result.rows[0]
        });
    } catch (e) {
        return res.status(501).send({
            success: false,
            error: e
        });
    }
}

module.exports = { createCategory, getCategory, getAllCategory, updateCategory, deleteCategory }
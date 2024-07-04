const { client } = require('../database');

async function createRating(req, res) {
    const { product_id, user_id, rate_value, review_comment, active } = req.body

    try {
        const query = `INSERT INTO "rating" (rate_value, review_comment, active, product_id, user_id)
                       VALUES ($1, $2, $3, $4, $5)`;

        const values = [rate_value, review_comment, active, product_id, user_id];

        const result = await client.query(query, values);

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

async function getRating(req, res) {
    const { product_id } = req.query

    try {
        const query = `SELECT * FROM "rating" WHERE product_id=${product_id}`;

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

async function getAllRating(req, res) {
    try {
        const query = `SELECT * FROM "rating"`;

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

async function updateRating(req, res) {
    const { id } = req.query;
    const { product_id, user_id, rate_value, review_comment, active } = req.body


    try {
        const query = `
            UPDATE "rating" 
            SET rate_value = $1, 
                review_comment = $2, 
                active = $3, 
                product_id = $4, 
                user_id = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *;
        `;

        const values = [rate_value, review_comment, active, product_id, user_id, id];

        const result = await client.query(query, values);

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

async function deleteRating(req, res) {
    const { id } = req.query;
    const { active } = req.body

    try {
        const query = `
            UPDATE "rating" 
            SET active = $1
            WHERE id = $2
            RETURNING *;
        `;

        const values = [active, id];

        const result = await client.query(query, values);

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


module.exports = { createRating, getRating, getAllRating, updateRating, deleteRating };
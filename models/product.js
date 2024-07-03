const { client } = require('../database');


async function createProduct(req, res) {
    const { name, img, description, price, stock, status, options, discount_id } = req.body;

    console.log(name, img, description, price, stock, status, options, discount_id);

    try {
        const query = `
            INSERT INTO "product" (name, img, description, price, stock, status, options, discount_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [name, img, description, price, stock, status, options, discount_id];

        const result = await client.query(query, values);

        res.status(200).send({
            status: 200,
            data: result.rows[0]
        });
    } catch (e) {
        res.status(501).send({
            success: false,
            error: e
        });
    }
}

async function getProduct(req, res) {

}

async function getAllProducts(req, res) {

}

async function updateProduct(req, res) {

}

async function deleteProduct(req, res) {

}


module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct }
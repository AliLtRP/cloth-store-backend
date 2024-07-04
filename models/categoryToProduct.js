const { client } = require('../database');


async function createCategoryToProduct(req, res) {
    const { category_id, product_id } = req.body;

    console.log(category_id, product_id);

    try {
        const query = `
        INSERT INTO "categorytoproduct" (product_id, category_id) 
        VALUES ($1, $2)
        RETURNING *;
    `;

        const values = [product_id, category_id];

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

async function getAllProductsAttachToCategory(req, res) {
    const { id } = req.query;

    try {
        const query = `SELECT p.* FROM product as p
                       JOIN categoryToProduct as ctp ON ctp.product_id=p.id
                       JOIN category c ON ctp.category_id = c.id
                       WHERE c.id = $1`;

        const values = [id];

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

async function getCategoryToProduct(req, res) {

}

async function getCategoryToProduct(req, res) {

}

async function getCategoryToProduct(req, res) {

}


module.exports = { createCategoryToProduct, getAllProductsAttachToCategory, getCategoryToProduct }
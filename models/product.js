const { client } = require('../database');


async function createProduct(req, res) {
    const { name, img, description, price, stock, status, options, discount_id, category_id } = req.body;

    try {
        const query = `
            INSERT INTO "product" (name, img, description, price, stock, status, options, discount_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [name, img, description, price, stock, status, options, discount_id];

        const result = await client.query(query, values);

        const queryCategoryToProduct = `
            INSERT INTO "categorytoproduct" (product_id, category_id) 
            VALUES ($1, $2)
            RETURNING *;
        `;

        const valueSCategoryToProduct = [result.rows[0].id, category_id];

        const re = await client.query(queryCategoryToProduct, valueSCategoryToProduct);

        return res.status(200).send({
            status: 200,
            data: { product: result.rows[0], categoryToProduct: re.rows[0] }
        });
    } catch (e) {
        console.log(e);
        return res.status(501).send({
            success: false,
            error: e
        });
    }
}

async function getProduct(req, res) {
    const { id } = req.query;

    try {
        const query = `SELECT * FROM "product" WHERE id=${id}`;

        const result = await client.query(query);

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

async function getAllProducts(req, res) {
    try {
        const query = `SELECT * FROM "product"`

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

async function updateProduct(req, res) {
    const { id, name, img, description, price, stock, status, options, discount_id } = req.body;

    try {
        const query = `
            UPDATE "product" 
            SET name = $1, 
                img = $2, 
                description = $3, 
                price = $4, 
                stock = $5, 
                status = $6, 
                options = $7, 
                discount_id = $8,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING *;
        `;

        const values = [name, img, description, price, stock, status, options, discount_id, id];

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

async function deleteProduct(req, res) {
    const { id, status } = req.body;

    try {
        const query = `
            UPDATE "product" 
            SET status = $2
            WHERE id = $1
            RETURNING *;
        `;

        const values = [id, status];

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


module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct }
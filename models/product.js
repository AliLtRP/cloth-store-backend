const { client } = require('../database');
const { isDiscountValid } = require('./order');


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
    const { id } = req.query;
    const { name, img, description, price, stock, status, options, discount_id } = req.body;

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
    const { id } = req.query;
    const { status } = req.body;

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


async function getTopRatedProduct(req, res) {
    try {
        const query = `SELECT 
    p.id,
    p.name,
    p.img,
    p.description,
    p.price,
    p.stock,
    p.status,
    p.options,
    p.discount_id,
    p.created_at,
    p.updated_at,
    AVG(r.rate_value) AS average_rating
FROM 
    product p
JOIN 
    rating r ON p.id = r.product_id
WHERE 
    r.active = true
GROUP BY 
    p.id
ORDER BY 
    average_rating DESC
`;

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


async function fetchDiscountedProducts(req, res) {
    const query = `SELECT p.*
                   FROM "product" p
                   JOIN "discount" d ON p.discount_id = d.id`;

    try {
        const result = await client.query(query);

        const discountProduct = await isDiscountValid(result.rows);

        return res.status(200).send({
            success: true,
            data: discountProduct
        })
    } catch (error) {
        console.error('Error fetching discounted products:', error);
        res.status(501).send({
            success: false,
            error: error
        })
        throw error;
    }
}



module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, getTopRatedProduct, fetchDiscountedProducts }
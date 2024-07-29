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
        const productQuery = `SELECT * FROM "product" WHERE id=$1`;
        const productResult = await client.query(productQuery, [id]);

        if (productResult.rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }

        const product = productResult.rows[0];

        let discount = null;
        if (product.discount_id) {
            const discountQuery = `SELECT * FROM "discount" WHERE id=$1`;
            const discountResult = await client.query(discountQuery, [product.discount_id]);
            if (discountResult.rows.length > 0) {
                discount = discountResult.rows[0];
            }
        }

        const ratingQuery = `
            SELECT 
                AVG(rate_value) AS average_rating 
            FROM "rating" 
            WHERE product_id=$1 AND active=true
        `;
        const ratingResult = await client.query(ratingQuery, [id]);
        const averageRating = ratingResult.rows[0].average_rating;

        let finalPrice = product.price;
        if (discount) {
            if (discount.type === '%') {
                finalPrice -= (parseFloat(discount.value) / 100) * product.price;
            } else {
                finalPrice -= parseFloat(discount.value);
            }
            finalPrice = Math.max(finalPrice, 0);
        }



        // const relatedItemsResult = await relatedProducts(id);

        return res.status(200).send({
            success: true,
            data: {
                ...product,
                final_price: finalPrice,
                discount: discount,
                average_rating: averageRating,
                related_items: []
            }
        });
    } catch (e) {
        console.error('Error fetching product', e);
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



async function fetchProductsByIds(ids) {
    console.log(ids, 'ids');
    if (ids.length === 0) {
        return [];
    }

    const query = `SELECT * FROM product WHERE id = ANY($1::int[]) ORDER BY id ASC`;

    try {
        const res = await client.query(query, [ids]);
        return res.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

async function getSpecificProductId(req, res) {
    const { id } = req.body;

    try {
        const ids = Array.isArray(id) ? id : [id];

        if (ids.length === 1 && typeof ids[0] === 'number') {
            const query = 'SELECT * FROM "banner" WHERE id = $1';
            const values = [ids[0]];
            const result1 = await client.query(query, values);

            if (!result1.rows.length) {
                return res.status(404).json({ error: 'Banner not found' });
            }

            const result = await fetchProductsByIds(result1.rows[0].products_ids);
            const ratings = await getProductRating(ids);
            const productsWithRatings = result.map(product => {
                const rating = ratings.find(r => r.product_id === product.id);
                return { ...product, rating: rating ? rating.rate_value : null };
            });


            return res.status(200).send({
                success: true,
                data: productsWithRatings
            });
        }

        const result = await fetchProductsByIds(ids);
        const ratings = await getProductRating(ids);
        const productsWithRatings = result.map(product => {
            const rating = ratings.find(r => r.product_id === product.id);
            return { ...product, rating: rating ? rating.rate_value : null };
        });

        return res.status(200).send({
            success: true,
            data: productsWithRatings
        });
    } catch (err) {
        console.error('Error fetching specific product IDs', err);
        return res.status(500).send('Error fetching specific product IDs');
    }
}


async function getProductRating(ids) {
    const query = `
        SELECT 
            p.id AS product_id,
            p.name,
            p.img,
            p.description,
            p.price,
            r.rate_value
        FROM 
            product p 
        JOIN 
            rating r ON p.id = r.product_id 
        WHERE 
            p.id = ANY($1::int[])
    `;

    const values = [ids];

    try {
        const result = await client.query(query, values);
        return result.rows;
    } catch (e) {
        console.error('Error executing query', e);
        throw e;
    }
}

async function relatedProducts(id) {
    const relatedItemsQuery = `
    SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.img,
        p.options,
        p.discount_id,
        COALESCE(
            CASE 
                WHEN d.type = '%' THEN p.price - (p.price * (NULLIF(d.value, '')::numeric / 100)) 
                ELSE p.price - NULLIF(d.value, '')::numeric 
            END, 
            p.price
        ) AS final_price,
        d.value AS discount_value,
        d.type AS discount_type,
        COALESCE(AVG(r.rate_value), 0) AS average_rating
    FROM 
        "product" p
    LEFT JOIN 
        "discount" d ON p.discount_id = d.id
    LEFT JOIN 
        "rating" r ON p.id = r.product_id AND r.active = true
    WHERE 
        p.id IN (
            SELECT product_id 
            FROM "categorytoproduct" 
            WHERE category_id = (
                SELECT category_id 
                FROM "categorytoproduct" 
                WHERE product_id = $1
            )
        )
        AND p.id != $1
    GROUP BY 
        p.id, d.value, d.type
    ORDER BY 
        average_rating DESC
    LIMIT 8;
`;

    try {
        const relatedItemsResult = await client.query(relatedItemsQuery, [id]);
        return relatedItemsResult.rows;
    } catch (e) {
        console.error('Error fetching related products', e);
        throw new Error("Related products not fetched");
    }
}



module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, getTopRatedProduct, fetchDiscountedProducts, getSpecificProductId, fetchProductsByIds }
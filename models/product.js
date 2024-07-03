const { client } = require('../database');


async function createProduct(req, res) {
    const { name, img, description, price, stock, status, options } = req.body;

    console.log(name, img, description, price, stock, status, options);

    try {
        const query = `INSERT INTO "product" (name, img, description, price, stock, status, options) 
                       VALUES ('${name}', '${img}', '${description}','${price}', '${stock}', '${status}', '${options}')`;


        const result = await client.query(query);

        res.status(200).send({
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

async function getProduct(req, res) {

}

async function getAllProducts(req, res) {

}

async function updateProduct(req, res) {

}

async function deleteProduct(req, res) {

}


module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct }
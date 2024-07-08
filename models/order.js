const jwt = require("jsonwebtoken");
const { client } = require('../database');

async function orderRouter(req, res) {
    const { items, address, phone, total_price, city, country, statusCode } = req.body;

    try {

        // const itemsJson = JSON.stringify(items);

        const userId = req.user.id;

        const query = `
        INSERT INTO "order" (items, address, phone, total_price, city, country, statusCode, userId)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id;
        `

        const values = [items, address, phone, total_price, city, country, statusCode, userId];
        const result = await client.query(query, values)

        const orderId = result.rows[0].id;

        res.status(201).json({ orderId, message: 'Order placed successfully' });
    } catch (error) {

        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

async function getRecentOrder(req, res) {

    const userId = req.user.id;

    try {

        const query = `
        SELECT * FROM "order"
        WHERE userId = $1
        ORDER BY created_at DESC
        LIMIT 1
        `;

        const values = [userId];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json(result.rows[0]);


    } catch (error) {
        console.error('Error retrieving recent order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function getAllOrders(req, res) {

    const userId = req.user.id;

    try {

        const query = `SELECT * FROM "order"
                       WHERE userId = $1
                       ORDER BY created_at DESC `;

        const values = [userId];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json(result.rows[0]);


    } catch (error) {
        console.error('Error retrieving orders history:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function updateOrder(req, res) {

    const { id } = req.query;

    try {
        const query = `

        `;
    } catch (error) { }


}

async function deleteOrder(req, res) {

}

module.exports = { orderRouter, getRecentOrder, getAllOrders, updateOrder, deleteOrder };
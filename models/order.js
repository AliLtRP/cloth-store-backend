const jwt = require("jsonwebtoken");
const { client } = require('../database');

async function orderRouter(req, res) {
    const { items, address, phone, total_price, city, country, statuscode, user_id, voucher_id } = req.body;

    try {
        let finalTotalPrice = total_price;

        if (voucher_id) {
            const voucherQuery = `
            SELECT type , value
            FROM voucher
            WHERE id = 1$
            `;

            voucherResult = await client.query(voucherQuery, [voucher_id])

            if (voucherResult.rows.length > 0) {

                const { type, value } = voucherResult.rows[0];
                if (type == number) {
                    finalTotalPrice -= value;
                } else if (type == percentage) {
                    finalTotalPrice -= (total_price * value) / 100;
                }
            }
        }

        const query = `
        INSERT INTO "order" (items, address, phone, total_price, city, country, statuscode, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *;
        `;

        const values = [items, address, phone, finalTotalPrice, city, country, statuscode, user_id];
        const result = await client.query(query, values)

        const orderId = result.rows[0].id;

        res.status(201).json({ orderId, message: 'Order placed successfully' });
    } catch (error) {

        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

async function getRecentOrder(req, res) {

    const { id } = req.query;

    try {

        const query = `
        SELECT * FROM "order"
        WHERE userId = $1
        ORDER BY created_at DESC
        LIMIT 1
        `;

        const values = [id];
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


    try {

        const query = `SELECT * FROM "order" `;

        const result = await client.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json(result.rows);


    } catch (error) {
        console.error('Error retrieving orders history:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getOrderById(req, res) {
    const { id } = req.query;

    const query = 'SELECT * FROM "order" WHERE id = $1';
    const values = [id];
    const result = await client.query(query, values);
    try {
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'order not found' });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error('Error retrieving specific order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function updateOrder(req, res) {
    const { id } = req.query;
    const { items, address, phone, total_price, city, country, statuscode, user_id } = req.body;

    try {
        const query = `
       UPDATE "order"
       SET items = $1, address = $2, phone = $3, total_price = $4, city = $5, country = $6, statuscode = $7, user_id = $8
       WHERE id = $9
       RETURNING id;
       `;

        const values = [items, address, phone, total_price, city, country, statuscode, user_id, id];
        const result = await client.query(query, values)

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'order updated successfully', id: result.rows[0].id });
        } else {
            res.status(404).json({ error: 'order not found' });
        }
    } catch (error) {

        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });

    }

}

async function deleteOrder(req, res) {
    const { id } = req.query;
    const { status } = req.body;

    try {
        const query = `UPDATE "order"
        SET statuscode=$1
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

module.exports = { orderRouter, getRecentOrder, getAllOrders, updateOrder, deleteOrder, getOrderById };
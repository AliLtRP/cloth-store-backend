const jwt = require("jsonwebtoken");
const { client } = require('../database');

async function orderRouter(req,res){
    const {items , address , phone , total_price,city,country,statusCode} = req.body;

    try {

        // const itemsJson = JSON.stringify(items);

        const userId=req.user.id;

        const query = `
        INSERT INTO "order" (items, address, phone, total_price, city, country, statusCode, userId)
        VALUES (${items}, ${address}, ${phone}, ${total_price}, ${city}, ${country}, ${statusCode}, ${userId})
         RETURNING id;
        `

        const values = [items, address , phone , total_price,city,country,statusCode,userId];
        const result=await client.query(query,values)

        const orderId=result.rows[0].id;

        res.status(201).json({ orderId, message: 'Order placed successfully' });
    } catch (error){

        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

module.exports={orderRouter};
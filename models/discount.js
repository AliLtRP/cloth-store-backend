const { client } = require('../database');

async function discountRouter(req,res){
    const {value,type,start_date,end_date,active}=req.body;

    try{

        const query = `
        INSERT INTO "discount" (value,type,start_date,end_date,active)
        VALUES (${value},${type},${start_date},${end_date},${active})
        `

        await client.query(query)
        res.status(200).json({ message: 'Discount added successfully' });

    } catch(error) {
        console.error('Error adding discount:', error);
        res.status(500).json({ error: 'Failed to add discount' }); 
    }
}

module.exports={discountRouter}
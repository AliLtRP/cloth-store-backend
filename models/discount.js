const { client } = require('../database');

async function discountRouter(req, res) {
    const { value, type, start_date, end_date, active } = req.body;

    try {
        const query = `
            INSERT INTO "discount" (value, type, start_date, end_date, active)
            VALUES ($1, $2, $3, $4, $5)
        `;
        
        await client.query(query, [value, type, start_date, end_date, active]);
        
        res.status(200).json({ message: 'Discount added successfully' });
    } catch (error) {
        console.error('Error adding discount:', error);
        res.status(500).json({ error: 'Failed to add discount' });
    }
}

async function getAllDiscount(req,res){

    try{
        const query = `
        SELECT * FROM "discount";
        `;

        await client.query(query);
        res.status(200).json({ message: 'All discounts shown successfully' });
    }catch(error){
        console.error('Error showing discount:', error);
        res.status(500).json({ error: 'Failed to show discount' });
    }
}

async function getDiscountById(req,res){
    const {id} = req.query;
    try{
        const query = 'SELECT * FROM "discount" WHERE id = $1';
        const values = [id];
        const result = await client.query(query, values);
        
        if(result.rows.length===0){
            return res.status(404).json({message:'discount not found'});
        }
        res.status(200).json(result.rows[0]);
    } catch(error) {
        console.error('Error retrieving specific discount:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}
async function updateDiscount(req,res){

}

module.exports={discountRouter,getAllDiscount,getDiscountById}
const { client } = require('../database');

async function voucherRouter(req,res){

    const {value , type , start_date , end_date ,max_amount , min_amount ,apply_over_discount,no_of_usage , users , first_order , active}=req.body;

    try {

        const query=`
        INSERT INTO "voucher" (value,type , start_date , end_date ,max_amount , min_amount ,apply_over_discount,no_of_usage , users , first_order , active)
        VALUE(${value},${type},${start_date },${end_date},${max_amount},${min_amount},${apply_over_discount},${users},${first_order},${active}) 
        RETURNING id;     
        `

        const values=[value,type , start_date , end_date ,max_amount , min_amount ,apply_over_discount,no_of_usage , users , first_order , active];
        const result = await client.query(query, values);

        res.status(201).json({ message: 'Voucher added successfully', voucherId: result.rows[0].id });
    } catch (error) {
        console.error('Error adding voucher:', error);
        res.status(500).json({ error: 'Failed to add voucher' });
    }
}

module.exports= {voucherRouter};
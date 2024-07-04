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

async function getAllVouchers(req,res){
    try {
        const query = 'SELECT * FROM vouchers';
        const result = await client.query(query);

        if(result.rows.length===0){
            return res.status(404).json({ message: 'No vouchers found' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving vouchers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getVoucherById(req,res){
    const {id} = req.query;

    try {
        const query='SELECT * FROM "voucher" WHERE id = $1'
        const values = [id];
        const result = await client.query(query,values);

        if(result.rows.length===0){
            return res.status(404).json({message:'voucher not found'});
        }
        res.status(200).json(result.rows[0]);
    } catch(error) {
        console.error('Error retrieving specific voucher:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function updateVoucher(req,res){
    const {id} = req.query;

    const {value , type , start_date , end_date ,max_amount , min_amount ,apply_over_discount,no_of_usage , users , first_order , active}=req.body;

    try{
       const query = `
        UPDATE "voucher"
        SET value = $1, type = $2, start_date = $3, end_date = $4, max_amount = $5, min_amount = $6, apply_over_discount = $7, no_of_usage = $8, users = $9, first_order = $10, active = $11
        WHERE id = $12
        RETURNING id;
        `; 

        const values = [value, type, start_date, end_date, max_amount, min_amount, apply_over_discount, no_of_usage, users, first_order, active, voucherId];
        const result = await client.query(query, values);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Voucher updated successfully', voucherId });
        } else {
            res.status(404).json({ error: 'Voucher not found' });
        }
    } catch (error) {
        console.error('Error updating voucher:', error);
        res.status(500).json({ error: 'Failed to update voucher' });
    }
    
}
async function deleteVoucher(req,res){

}

module.exports= {voucherRouter,getAllVouchers,getVoucherById};
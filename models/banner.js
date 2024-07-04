const { client } = require('../database');

async function bannerRouter(req,res){

    const {title , img , description , priority , type , discount ,products_ids,banners , active}=req.body;

    try {

        const query=`
        INSERT INTO "banner" (title,img , description , priority ,type  , discount  ,products_ids,banners , active)
        VALUE(${title},${img},${ description },${priority},${type},${discount},${products_ids},${banners},${active}) 
        RETURNING id;     
        `
        const values=[title,img , description , priority ,type  , discount  ,products_ids,banners , active];
        const result = await client.query(query, values);

        res.status(201).json({ message: 'banner added successfully', bannerId: result.rows[0].id });
    } catch (error) {
        console.error('Error adding banner:', error);
        res.status(500).json({ error: 'Failed to add banner' });
    }
}

async function getAllBanners(req,res){
    try {
        const query = `SELECT * FROM "banner";`;
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving banners:', error);
        res.status(500).json({ error: 'Failed to retrieve banners' });
    }
}

async function updateBanner(req,res){

}

async function deleteBanner(req,res){
    
}
module.exports= {bannerRouter};
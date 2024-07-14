const { client } = require('../database');
// const { fetchProductsByIds } = require('./product');

async function bannerRouter(req, res) {
    const { title, img, description, priority, type, discount, products_ids, banners, active } = req.body;

    try {
        const query = `
        INSERT INTO "banner" (title,img , description , priority ,type  , discount  ,products_ids,banners , active)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) 
        RETURNING id;     
        `;
        const values = [title, img, description, priority, type, discount, products_ids, banners, active];
        const result = await client.query(query, values);

        res.status(201).json({ message: 'banner added successfully', bannerId: result.rows[0].id });
    } catch (error) {
        console.error('Error adding banner:', error);
        res.status(500).json({ error: 'Failed to add banner' });
    }
}


async function fetchProductsByIds(ids) {
    if (ids.length === 0) {
        return [];
    }

    const query = `SELECT * FROM product WHERE id = ANY($1::int[]) ORDER BY id ASC LIMIT 8`;

    try {
        const res = await client.query(query, [ids]);
        return res.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

async function getAllBanners(req, res) {
    try {
        const query = `SELECT * FROM "banner";`;
        const result = await client.query(query);

        for (let i = 0; i < result.rows.length; i++) {
            if (result.rows[i].products_ids) {
                result.rows[i].products_ids = await fetchProductsByIds(result.rows[i].products_ids);
            }
        }

        res.status(200).send({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error retrieving banners:', error);
        res.status(500).json({ error: 'Failed to retrieve banners' });
    }
}

async function updateBanner(req, res) {

    const { id } = req.query;
    const { title, img, description, priority, type, discount, products_ids, banners, active } = req.body;

    try {
        const query = `
       UPDATE "banner"
       SET title = $1, img = $2, description = $3, priority = $4, type = $5, discount = $6, products_ids = $7, banners = $8, active = $9
       WHERE id = $10
       RETURNING id;
       `;

        const values = [title, img, description, priority, type, discount, products_ids, banners, active, id];
        const result = await client.query(query, values)

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'banner updated successfully', id: result.rows[0].id });
        } else {
            res.status(404).json({ error: 'banner not found' });
        }
    } catch (error) {

        console.error('Error updating banner:', error);
        res.status(500).json({ error: 'Failed to update banner' });

    }
}

async function getBannerById(req, res) {
    const { id } = req.query;

    console.log(id);
    try {
        const query = 'SELECT * FROM "banner" WHERE id = $1';
        const values = [id];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'banner not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error retrieving specific banner:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

async function deleteBanner(req, res) {
    const { id } = req.query;
    const { status } = req.body;

    try {
        const query = `UPDATE "banner"
        SET active=$1
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

module.exports = { bannerRouter, getAllBanners, updateBanner, getBannerById, deleteBanner };
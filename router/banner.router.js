const express = require('express');
const router = express.Router();

const {bannerRouter,getAllBanners,updateBanner,getBannerById,deleteBanner} = require ('../models/banner');

router.post('/' , bannerRouter);
router.get('/all',getAllBanners);
router.get('/',getBannerById);
router.put('/update',updateBanner);
router.delete('/delete',deleteBanner);



module.exports = router;
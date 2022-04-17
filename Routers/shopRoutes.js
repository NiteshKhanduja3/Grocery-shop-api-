const router = require("express").Router();
const {
  // getShops,
  getshop,
  createshop,
  updateShop,
  deleteShop,
  getShopsInRadius,
} = require('../Controllers/ShopController');

// const Shop = require('../models/shopsModel');;

router.route('/radius/:zipcode/:distance').get(getShopsInRadius);

// router
//   .route('/:id/photo')
//   .put(protect, authorize('publisher', 'admin'), ShopPhotoUpload);

router
  .route('/')
//   .get(AllResults(Shop, 'courses'), getShops)
  .post(createshop);

router
  .route('/:id')
  .get(getshop)
  // .put(updateShop)
  // .delete( deleteShop);

module.exports = router;
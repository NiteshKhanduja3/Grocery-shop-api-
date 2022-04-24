// const path = require('path');
// const ErrorResponse = require('../utils/errorResponse');
const geocoder = require("../Utils/geocoder");
const asyncHandler = require("../Middleware/async");
const Shop = require("../models/shopsModel");

// Get single shop
//    GET shop/:id

exports.getshop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    return res.status(404).send({ message: "No shop Found" });
  }

  res.status(200).json({ success: true, data: shop,error:false,status:200,message:"ShopData" });
});

//     Create new shop
//      POST shop/

exports.createshop = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  // req.body.user = req.user.id;

  // Check for published shop
  // const publishedshop = await Shop.findOne({ user: req.user.id });

  // // If the user is not an admin, they can only add one shop
  // if (publishedshop) {
  //   return res.status(400).send({ message: "Shop already there" });
  // }

  // const shop = await Shop.save(req.body);
  const shop = await Shop.create(req.body);

  res.status(201).json({
    error:false,
    staus:201,
    success: true,
    data: shop,
  });
});


exports.getShopsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;
  
    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
  
    const radius = distance / 3963;
  
    const shops = await Shop.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    console.log("Shops",shops)
  
    res.status(200).json({
      success: true,
      count: shops.length,
      data: shops
    });
  });
  


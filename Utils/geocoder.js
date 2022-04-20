const NodeGeocoder = require('node-geocoder');

const options = {
  provider:process.env.GEO_NAME,
  httpAdapter: 'https',
  apiKey: process.env.MAP_QUEST,
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
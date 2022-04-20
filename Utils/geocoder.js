const NodeGeocoder = require('node-geocoder');
import { env } from 'process';

const options = {
  provider: env.GEO_NAME,
  httpAdapter: 'https',
  apiKey: env.MAP_QUEST,
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
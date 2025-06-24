const { SquareClient, SquareEnvironment, SquareError } = require("square");
require('dotenv').config()

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
environment: process.env.SQUARE_LOCATION_ID,
});

export default client;

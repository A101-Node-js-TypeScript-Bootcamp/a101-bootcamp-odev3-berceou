const express = require('express')
let router = express.Router();

const productEndpoint = require('./product/product')

router.use('/product',productEndpoint)  //localhost:3000/api/product


module.exports = router;
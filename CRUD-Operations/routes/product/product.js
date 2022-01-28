const aws = require('aws-sdk');
const express = require('express')
let router = express.Router();

let productController = require('../../controllers/Product')

router.post('/',productController.addProduct);
router.get('/',productController.fetchAll);
router.get('/:id',productController.fetchByProductID);
router.get('/:isDiscount',productController.fetchByisDiscount);
router.put('/:id',productController.modifyProductStock);
router.delete('/:id',productController.delete);

module.exports = router;
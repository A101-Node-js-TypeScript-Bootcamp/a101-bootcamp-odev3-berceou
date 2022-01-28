const AWS = require('aws-sdk')
const uuidv4 = require('uuid')
const productModel = require('../model/product')

exports.addProduct = async (req,res) => {
    const response = await productModel.addProduct(req.body);
    res.send(response);
}
exports.fetchAll = async (req,res) => {
    const response = await productModel.fetchAll();
    res.send(response); 
}

exports.fetchByProductID = async (req,res) => {
    const response = await productModel.fetchByProductID(req.body);
    res.send(response);
}

exports.fetchByisDiscount = async (req,res) => {
    const response = await productModel.fetchByisDiscount(req.body);
    res.send(response);
}

exports.modifyProductStock = async (req,res) => {
    const response = await productModel.modifyProductStock(req.body);
    res.send(response);
}

exports.delete = async (req,res) => {
    const response = await productModel.delete(req.params);
    res.send(response); 
}
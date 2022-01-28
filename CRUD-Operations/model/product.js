const AWS = require('aws-sdk')
const {v4:uuidv4} = require('uuid');
const { param } = require('../routes/product/product');

AWS.config.loadFromPath('./config.json');
/* This can replace the config file:
AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});
*/
let docClient = new AWS.DynamoDB.DocumentClient();
var table = process.env.DynamoDB_TABLE_NAME;

exports.addProduct = async (params)=>{
 //(params.isDiscount === "true") ? 'params.isDiscount = true' : (params.isDiscount === "false") ? 'params.isDiscount = false'
    const items = {
        TableName : table,
        Item: {
            productID: uuidv4(),
            productName: params.productName,
            stock: params.stock,
            isDiscount: params.isDiscount,
            category: {
                categoryID: uuidv4(),
                categoryName: params.category.categoryName,
            },
        }
    };
    try {
        await docClient.put(items).promise();
        return {
            status: true,
            message: 'Product information added SUCCESSFULLY'
        }
    } catch (err) {
        return {
            status: false,
            message: err
        }
    }
}

exports.fetchAll = async () => {
    const  items = {
        TableName:table
    };
    try {
        const data = await docClient.scan(items).promise();
        return {
            status: true,
            data: data.Items
        }
    } catch (err) {
        return {
            status: false,
            message: err
        }
    }
}

exports.fetchByProductID = async (params) => { 
    var items = {
        TableName: table,
        Key:{
            productID: params.productID
        },
    };
    try {
        const data = await docClient.get(items).promise();
        return {
            status: true,
            data: data
        }
    } catch (err) {
        return {
            status: false,
            message: err
        }
    }
}

exports.fetchByisDiscount = async (params) => { 
    var items = {
        TableName: table,
        Key:{},
        FilterExpression: "isDiscount = :isDiscount",
        ExpressionAttributeValues: { //if isDiscount=true, get all discounted products
            ":isDiscount": true,
        },
    };
    try {
        const data = await docClient.scan(items).promise();
        return {
            status: true,
            data: data
        }
    } catch (err) {
            return {
            status: false,
            message: err
           
        }
    }
}

exports.modifyProductStock = async (params) => {
     
    var items = {
        TableName:table,
        Key:{
           productID: params.productID,
            stock: params.stock
        },
    UpdateExpression: "set stock = :stock",
    ExpressionAttributeValues:{
        ":stock":params.stock,
    },
    ReturnValues:"UPDATED_NEW"
   };
    try {
        const data = await docClient.update(items).promise();
        return {
            status: true,
            data: data,
            message: 'The product stock has been updated!'
        }
    } catch (err) {
        return {
            status: false,
            message: err
        }
    }
}

exports.delete = async (params) => {
    var items = {
        TableName:table,
        Key:{
            productID : params.productID
        },
        ConditionExpression: "isDiscount = :isDiscount",
        ExpressionAttributeValues: {
            ":isDiscount":false,
        },
    };
    try {
        const response = await docClient.delete(items).promise();
        return {
            status: true,
            message: 'The product was successfully deleted!'
        }
    } catch (err) {
        return {
            status: false,
            message: 'This product CANNOT be deleted because the discount is defined!. '
        }
    }
}
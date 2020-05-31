const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.getAllOrders = (req, res, next) => {
    let query={};
    console.log(req.userData)
    if (req.userData.role === 'customer'){
        query.userId=req.userData.userId;
    }
    Order
        .find(query)
        .select('_id product quantity status')
        .populate('product', '_id name price')
        .populate('user', 'email')
        .exec()
        .then(orders => {
            res.status(200).json({
                count: orders.length,
                orders: orders
            });
        })
        .catch(error => {
            next(error);
        })
};

exports.createOneOrder = (req, res, next) => {

    Product
        .findById(req.body.productId)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product Not Found!'
                });
            }
            console.log(req.userData)
            return createOrder(req);
        })
        .then(order => {
            return order.save();
        })
        .then(order => {
            return res.status(201).json({
                message: 'Order was created',
                order: {
                    _id: order._id,
                    product: order.product,
                    quantity: order.quantity
                }
            });
        })
        .catch(error => {
            next(error);
        });
};

exports.getOneOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    Order
        .findById(orderId)
        .select('_id product quantity status')
        .populate('product', '_id name price')
        .populate('user', 'email')
        .exec()
        .then(order => {
            return res.status(201).json(order);
        })
        .catch(error => {
            next(error);
        });
};

exports.updateOneOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    Order
        .update({ _id: orderId }, { $set: req.body })
        .exec()
        .then(result => {
            return res.status(200).json({
                message: 'Updated Order Successfully!',
                result: result
            });
        })
        .catch(error => {
            next(error);
        });
};

exports.orderStatusAction = (req, res, next) => {
    console.log(req.userData)
    if (req.userData.role === 'seller') {
        const orderId = req.params.orderId;
        Order
            .update({ _id: orderId }, { $set: req.body })
            .exec()
            .then(result => {
                return res.status(200).json({
                    message: `Order ${req.body.status} Successfully!`,
                    result: result
                });
            })
            .catch(error => {
                next(error);
            });
    }
    else {
        next({message:"this action only allowed for seller"});
    }
};

exports.deleteOneOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    Order
        .remove({ _id: orderId })
        .exec()
        .then(result => {
            return res.status(200).json({
                message: 'Deleted order!',
                result: result
            });
        })
        .catch(error => {
            next(error);
        });
};

function createOrder(req) {
    return new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity,
        user: req.userData.userId,
        status: req.body.status
    });
}
const { food_link, orderfoodrel_link, order_link } = require("../models")
const { Op } = require("../models").Sequelize
const { validationResult } = require("express-validator")

exports.insert = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        let extractedErrors = []
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

        res.status(422).json({
            message: extractedErrors
        })
    }
    else {
        try {
            let newOrder = await order_link.create({ 
                customerName: req.body.customerName, 
                phone: req.body.phone, 
                additionalRequest: req.body.additionalRequest
            })
            res.send(newOrder)
        }
        catch(err) {
            res.status(422).json({
                message: err.message
            })
        }
    }
}

exports.deleteOne = (req, res) =>{
    const id = req.params.ordersId;
    order_link.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({ message : `Successfully deleted Order with id=${id}`});
        }
        else{
            res.status(422).send({ message: `Cannot delete Order with id=${id}. Maybe the Order was nonexist!` });
        }
    })
    .catch(err => {
        res.status(422).send({
            message: "Some error occured while deleting the Order with id=" + id
        });
    }); 
}

exports.update = async (req, res) => {
    try {
        let updateOrder = await order_link.findOne({ where: {id: req.params.ordersId} })
        if(!updateOrder) throw new Error("not found")

        updateOrder.name = req.body.name ? req.body.name : updateOrder.name
        updateOrder.phone = req.body.phone ? req.body.phone : updateOrder.phone
        updateOrder.additionalRequest = req.body.additionalRequest ? req.body.additionalRequest : updateOrder.additionalRequest
        updateOrder.save()

        res.send(updateOrder)
        
    }
    catch(err) {
        res.status(422).json({
            message: err.message
        })
    }
}

exports.findAll = async (req, res) => {
    let skip = req.query.$skip ? parseInt(req.query.$skip) : 0
    let limit = req.query.$limit ? parseInt(req.query.$limit) : 10
    let orderWhere = {}
    
    if(req.query.customerName) {
        if(req.query.customerName.$like) {
            orderWhere.customerName = { [Op.like]: req.query.customerName.$like }
        }
        else  {
            orderWhere.customerName = req.query.customerName
        }
    }
    try {
        let orders = await order_link.findAll({
            limit: limit,
            offset: skip, 
            where: orderWhere, distinct: true,
            include: [{
                model: orderfoodrel_link,
                required: false,
                include: [{ 
                    model: food_link,
                    required: false,
                    attributes: {
                        exclude: [ 
                            "createdAt",
                            "updatedAt"
                        ]
                    }
                }]
            }],
            order: [
                ["id", "ASC"]
            ]
        })

        let count = await order_link.findAndCountAll({
            where: orderWhere
        })

        res.send({
            count: count.count,
            result: orders.map((groups) => {
                let foods = []
                groups.orderfoodRels.forEach(({ food }) => { 
                    if(food) foods.push(food) 
                })

                return {
                    id: groups.id,
                    customerName: groups.customerName,
                    phone: groups.phone,
                    additionalRequest: groups.additionalRequest,
                    createdAt: groups.createdAt,
                    updatedAt: groups.updatedAt,
                    food: foods
                }
             })
        })
    }
    catch(err) {
        res.status(422).json({
            message: err.message
        })
    }
}

exports.findOne = async (req, res) => {
    try {
        let order = await order_link.findOne({ 
            where: { id: req.params.ordersId },
            include: [{
                model: orderfoodrel_link,
                required: false,
                include: [{ 
                    model: food_link,
                    required: false,
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt"
                        ]
                    }
                }]
            }]
        })

        if(!order) throw new Error("Order not found")

        let foods = []
        order.orderfoodRels.forEach(({ food }) => { 
            if(food) foods.push(food) 
        })

        res.send({
            id: order.id,
            customerName: order.customerName,
            phone: order.phone,
            additionalRequest: order.additionalRequest,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            food: foods
        })
    }
    catch(err) {
        res.status(422).json({
            message: err.message
        })
    }
}

exports.orderFoods = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        let extractedErrors = []
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

        res.status(422).json({
            message: extractedErrors
        })
    }
    else {
        try {
            let orderFood = await order_link.findOne({ where: {id: req.params.ordersId} })
            if(!orderFood) throw new Error("Order not found, create an order first!")
    
            await orderfoodrel_link.destroy({ where: { orderId: req.params.ordersId } })
    
            let inputFoods = []
            if(Array.isArray(req.body.foodId)) {

                Array.from(new Set(req.body.foodId)).forEach((foodId) => {
                    inputFoods.push({ orderId: req.params.ordersId, foodId: Number(foodId) })
                })
            }
            else {
                inputFoods.push({ orderId: req.params.ordersId, foodId: Number(req.body.foodId) })
            }
    
            let newOrder = await orderfoodrel_link.bulkCreate(inputFoods)
    
            res.send(newOrder)
        }
        catch(err) {
            res.status(422).json({
                message: err.message
            })
        }
    }
}

const { food_link } = require("../models")
const db = require("../models");
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
            let newFood = await food_link.create({ 
                name: req.body.name, 
                type: req.body.type, 
                price: req.body.price, 
                vendorId: req.body.vendorsId 
            })
            res.send(newFood)
        }
        catch(err) {
            res.status(422).json({
                message: err.message
            })
        }
    }
}

exports.deleteOne = (req, res) =>{
    const id = req.params.foodsId;
    food_link.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({ message : `Successfully deleted Food with id=${id}`});
        }
        else{
            res.status(422).send({ message: `Cannot delete Food with id=${id}. Maybe Food was nonexist!` });
        }
    })
    .catch(err => {
        res.status(422).send({
            message: "Some error occured while deleting the Food with id=" + id
        });
    }); 
}

exports.update = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

        res.status(422).json({
            message: extractedErrors
        })
    }
    else {
        try {
            let updatedFood = await food_link.findOne({ where: {id: req.params.foodsId} })
            if(!updatedFood) throw new Error("food not found")

            updatedFood.name = req.body.name ? req.body.name : updatedFood.name
            updatedFood.type = req.body.type ? req.body.type : updatedFood.type
            updatedFood.price = req.body.price ? req.body.price : updatedFood.price
            updatedFood.vendorId = req.body.vendorId ? req.body.vendorId : updatedFood.vendorId
            updatedFood.save()
            res.send(updatedFood)
        }
        catch(err) {
            res.status(422).json({
                message: err.message
            })
        }
    }
}

exports.findAll = async (req, res) => {
    let limit = req.query.$limit ? parseInt(req.query.$limit) : 10
    let skip = req.query.$skip ? parseInt(req.query.$skip) : 0

    let vendorQuery, nameQuery, typeQuery, priceQuery;
    if (req.query.vendorsId && req.query.vendorsId !== '') {
        vendorQuery = `AND vendors.id = ${req.query.vendorsId}`;
    } else if (vendorQuery == undefined) {
        vendorQuery = ``;
    }
    if (req.query.type && req.query.type !== '') {
        typeQuery = `AND food.type = ${req.query.type}`;
    } else if (typeQuery == undefined) {
        typeQuery = ``;
    }
    if (req.query.price && req.query.price !== '') {
        priceQuery = `AND food.price < ${req.query.price}`;
    } else if (priceQuery == undefined) {
        priceQuery = ``;
    }
    if(req.query.name) {
        if (req.query.name.$like && req.query.name.$like !== '') {
            searchQuery = `AND food.name LIKE '${req.query.name.$like}'`;
        } else if (nameQuery == undefined) {
            nameQuery = ``;
        }
    }
    else if (req.query.name == undefined){
        nameQuery = ``
    }

    let OptLimit = `LIMIT ${skip}, ${limit}`

    let foodQuery = `
    SELECT
        food.id AS food_id,
        food.name AS food_name,
        food.type AS food_type,
        food.price AS food_price,
        vendors.id as vendor_id,
        vendors.name AS vendor_name
    FROM
        food
            INNER JOIN
        vendors ON vendors.id = food.vendorId
    WHERE
        1 = 1 ${vendorQuery} ${typeQuery} ${priceQuery} ${nameQuery}
    GROUP BY food_name
    ORDER BY food_name
    ${OptLimit}
    `

    let foodCountQuery = `
    SELECT 
        COUNT(*) AS total_foods
    FROM
        food
            INNER JOIN
        vendors ON vendors.id = food.vendorId
    WHERE
        1 = 1 ${vendorQuery} ${typeQuery} ${priceQuery} ${nameQuery}
    `
   
    try {
        let foodResult = await db.sequelize.query(foodQuery, {
            type: db.sequelize.QueryTypes.SELECT,
            logging: false
        })
        let foodCountResult = await db.sequelize.query(foodCountQuery, {
            type: db.sequelize.QueryTypes.SELECT,
            logging: false
        })
        res.send({ 
            count : foodCountResult[0].total_foods,
            result: foodResult
        })
    }
    catch(err) {
        res.status(422).send({
            result: err.message
        })
    }
}

exports.findOne = async (req, res) => {
    try {
        let food = await food_link.findOne({ where: { id: req.params.foodsId }, include: {model: db.vendor_link} })
        if(!food) throw new Error("Food not found");
        res.send(food)
    }
    catch(err) {
        res.status(422).json({
            message: err.message
        })
    }
}
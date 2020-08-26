const { vendor_link } = require("../models")
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
            let newVendor = await vendor_link.create({ name: req.body.name, address: req.body.address, phone:req.body.phone, tag:req.body.tag })
            res.send(newVendor)
        }
        catch(err) {
            res.status(422).json({
                message: err.message
            })
        }
    }
}

exports.deleteOne = (req, res) =>{
    const id = req.params.vendorsId;
    vendor_link.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({ message : `Successfully deleted Vendor with id=${id}`});
        }
        else{
            res.status(422).send({ message: `Cannot delete Vendor with id=${id}. Maybe Vendor was nonexist!` });
        }
    })
    .catch(err => {
        res.status(422).send({
            message: "Some error occured while deleting the Camera with id=" + id
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
            let updatedVendor = await vendor_link.findOne({ where: {id: req.params.vendorsId} })
            if(!updatedVendor) throw new Error("Vendor not found")

            updatedVendor.name = req.body.name ? req.body.name : updatedVendor.name
            updatedVendor.address = req.body.address ? req.body.address : updatedVendor.address
            updatedVendor.phone = req.body.phone ? req.body.phone : updatedVendor.phone
            updatedVendor.tag = req.body.tag ? req.body.tag : updatedVendor.tag
            updatedVendor.save()
            res.send(updatedVendor)
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
    let vendorWhere = {}

    if(req.query.name) {
        if(req.query.name.$like) {
            vendorWhere.name = { [Op.like]: req.query.name.$like }
        }
        else  {
            vendorWhere.name = req.query.name
        }
    }
    if(req.query.tag){
        vendorWhere.tag = { [Op.or]: [].concat(req.query.tag) }
    }
    try {
        let vendors = await vendor_link.findAndCountAll({
            limit: limit,
            offset: skip,
            where: vendorWhere
        })
        res.send({
            total: vendors.count,
            result: vendors.rows
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
        let vendor = await vendor_link.findOne({ where: { id: req.params.vendorsId } })
        if(!vendor) throw new Error("Vendor not found");
        res.send(vendor)
    }
    catch(err) {
        res.status(422).json({
            message: err.message
        })
    }
}
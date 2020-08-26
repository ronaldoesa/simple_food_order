module.exports = app => {
    const { insert, deleteOne, update, findAll, findOne } = require("../controllers/vendor-controllers")
    const { body } = require("express-validator")
    const { vendor_link } = require("../models")
    var router = require("express").Router()

    router.post("/", [
        body("name").exists().bail().notEmpty().bail().custom(value => {
            if(value.length > 128){
                    return Promise.reject("Vendor name is too long")
            }
            else
            {
                return vendor_link.findOne({ where: { name: value } }).then(vendor => {
                    if(vendor) {
                        return Promise.reject("Vendor name is already in use")
                    }
                })
            }
        }),
        body("address").exists().bail().notEmpty().bail().custom(value => {
            return vendor_link.findOne({ where: { address: value } }).then(vendor => {
                if(vendor) {
                    return Promise.reject("vendor address is already in use")
                }
            })
        }),
        body("phone").exists().bail().notEmpty().bail().custom(value => {
            return vendor_link.findOne({ where: { phone: value } }).then(vendor => {
                if(vendor) {
                    return Promise.reject("vendor phoneNumber is already in use")
                }
            })
        })
    ], insert)
    router.patch("/:vendorsId", update)
    router.delete("/:vendorsId", deleteOne)
    router.get("/", findAll)
    router.get("/:vendorsId", findOne)

    app.use('/vendors', router)
}
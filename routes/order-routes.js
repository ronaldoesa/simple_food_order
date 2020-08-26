module.exports = app => {
    const { insert, deleteOne, update, findAll, findOne, orderFoods } = require("../controllers/order-controllers")
    const { body } = require("express-validator")
    var router = require("express").Router()

    router.post("/", [
        body("customerName").exists().withMessage("Customer name is required").bail()
        .notEmpty().withMessage("Customer name is required"),
        body("phone").exists().withMessage("Customer phone is required").bail()
        .notEmpty().withMessage("Customer phone is required")
    ], insert)
    router.get("/", findAll)
    router.get("/:ordersId", findOne)
    router.patch("/:ordersId", update)
    router.delete("/:ordersId", deleteOne)
    router.patch("/food/assign/:ordersId", [
        body("foodId").exists().withMessage("foodId is required").bail().notEmpty().withMessage("food is empty").bail().custom(value => {
            if(Array.isArray(value)) {
                let isAllNumber = value.every((el) => !isNaN(el))
                if(!isAllNumber) return Promise.reject("foodId must be number")
                return Promise.resolve("all foodId is number")
            }
            else {
                if(isNaN(value))return Promise.reject("foodId must be number")
                return Promise.resolve("all foodId is number")
            }
        })
    ],orderFoods)

    app.use('/orders', router)
}
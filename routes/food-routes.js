module.exports = app => {
    const { insert, deleteOne, update, findAll, findOne } = require("../controllers/food-controllers")
    const { body } = require("express-validator")
    const { food_link } = require("../models")
    var router = require("express").Router()

    router.post("/", [
        body("name").exists().bail().notEmpty().bail().custom(value => {
            return food_link.findOne({ where: { name: value } }).then(food => {
                if(food) {
                    return Promise.reject("Food name is already in use")
                }
            })
        })
    ], insert)
    router.patch("/:foodsId", update)
    router.delete("/:foodsId", deleteOne)
    router.get("/", findAll)
    router.get("/:foodsId", findOne)

    app.use('/foods', router)
}
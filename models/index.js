'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
config.logging = console.log;
config.logQueryParameters = true;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}
fs.readdirSync(__dirname).filter(file => {
        return (file.indexOf('.') !== 0) && (file != basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//linker to models
db.vendor_link = require("./vendor.js")(sequelize, Sequelize);
db.food_link = require("./food.js")(sequelize, Sequelize);
db.order_link = require("./order.js")(sequelize, Sequelize);
db.orderfoodrel_link = require("./orderfoodrel.js")(sequelize, Sequelize);
//Associations
db.food_link.belongsTo(sequelize.models.vendor, {foreignKey: 'vendorId'})
db.vendor_link.hasMany(sequelize.models.food);

db.orderfoodrel_link.belongsTo(sequelize.models.food, {foreignKey: 'foodId'})
db.food_link.hasMany(sequelize.models.orderfoodRel)

db.orderfoodrel_link.belongsTo(sequelize.models.order, {foreignKey: 'orderId'})
db.order_link.hasMany(sequelize.models.orderfoodRel)

module.exports = db;
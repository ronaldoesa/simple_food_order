'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('food', [
      {
        name : 'Fried Chicken 1',
        type : 'beverages',
        price : '25000',
        createdAt : new Date(),
        updatedAt : new Date(),
        vendorId : '1'
      },
      {
        name : 'Drink 1',
        type : 'drinks',
        price : '5000',
        createdAt : new Date(),
        updatedAt : new Date(),
        vendorId : '1'
      },
      {
        name : 'Donut 1',
        type : 'beverages',
        price : '8000',
        createdAt : new Date(),
        updatedAt : new Date(),
        vendorId : '2'
      },
      {
        name : 'Drink GGWP',
        type : 'drinks',
        price : '6000',
        createdAt : new Date(),
        updatedAt : new Date(),
        vendorId : '2'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('food', [
      {name :'Fried Chicken 1'},{name :"Drink 1"},{name : "Donut 1"},{name: "Drink GGWP"}
    ])
  }
};

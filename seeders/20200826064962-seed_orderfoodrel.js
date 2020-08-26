'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('orderfoodrels', [
      {
        foodId : '1',
        orderId : '1',
        createdAt : new Date(),
        updatedAt : new Date()
      },
      {
        foodId : '2',
        orderId : '1',
        createdAt : new Date(),
        updatedAt : new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('orderfoodrels', [
      {orderId :'1'}
    ])
  }
};

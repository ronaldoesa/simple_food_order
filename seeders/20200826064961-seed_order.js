'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('orders', [
      {
        customerName : 'nancy',
        phone : '085254879918',
        additionalRequest : 'lebihin sambal yaa!',
        createdAt : new Date(),
        updatedAt : new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('orders', [
      {customerName :'nancy'}
    ])
  }
};

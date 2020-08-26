'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('vendors', [
      {
        name : 'KFC',
        address : 'Jalan Thamrin',
        phone : '021 472636',
        createdAt : new Date(),
        updatedAt : new Date(),
        tag : 'promo'
      },
      {
        name : 'Dunkin Donuts',
        address : 'Jalan Harmoni',
        phone : '021 472311',
        createdAt : new Date(),
        updatedAt : new Date(),
        tag : 'featured'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('vendors', [
      {name :'KFC'},{name :"Dunkin Donuts"}
    ])
  }
};

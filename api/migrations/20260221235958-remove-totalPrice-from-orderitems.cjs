'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const table = await queryInterface.describeTable('OrderItems');

    if (table.totalPrice) {
      await queryInterface.removeColumn('OrderItems', 'totalPrice');
    }

  },

  async down(queryInterface, Sequelize) {

    const table = await queryInterface.describeTable('OrderItems');

    if (!table.totalPrice) {
      await queryInterface.addColumn('OrderItems', 'totalPrice', {
        type: Sequelize.DOUBLE,
        allowNull: false,
      });
    }

  },
};
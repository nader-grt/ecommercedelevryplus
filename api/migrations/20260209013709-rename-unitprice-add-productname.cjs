'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const table = await queryInterface.describeTable('OrderItems');

    // 🟢 rename only if needed
    if (table.unitPrice && !table.price) {
      await queryInterface.renameColumn('OrderItems', 'unitPrice', 'price');
    }

    // 🟢 add productName only if not exists
    if (!table.productName) {
      await queryInterface.addColumn('OrderItems', 'productName', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }

  },

  async down(queryInterface) {

    const table = await queryInterface.describeTable('OrderItems');

    if (table.price && !table.unitPrice) {
      await queryInterface.renameColumn('OrderItems', 'price', 'unitPrice');
    }

    if (table.productName) {
      await queryInterface.removeColumn('OrderItems', 'productName');
    }

  }
};
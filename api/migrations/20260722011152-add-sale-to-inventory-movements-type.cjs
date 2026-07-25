'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('InventoryMovements', 'type', {
      type: Sequelize.ENUM('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER', 'RESERVE', 'RELEASE', 'SALE'),
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('InventoryMovements', 'type', {
      type: Sequelize.ENUM('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER', 'RESERVE', 'RELEASE'),
      allowNull: false
    });
  
  }
};

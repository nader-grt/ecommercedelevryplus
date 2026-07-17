'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE InventoryMovements
      MODIFY COLUMN type ENUM(
        'IN',
        'OUT',
        'ADJUSTMENT',
        'TRANSFER',
        'RESERVE',
        'RELEASE'
      ) NOT NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE InventoryMovements
      MODIFY COLUMN type ENUM(
        'IN',
        'OUT',
        'ADJUSTMENT',
        'TRANSFER'
      ) NOT NULL;
    `);
  },
};
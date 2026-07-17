"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.sequelize.query(`
      ALTER TABLE Orders
      MODIFY COLUMN status ENUM(
        'pending',
        'reserved',
        'paid',
        'shipped',
        'delivered',
        'cancelled'
      ) NOT NULL;
    `);

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.sequelize.query(`
      ALTER TABLE Orders
      MODIFY COLUMN status ENUM(
        'pending',
        'paid',
        'shipped',
        'delivered',
        'cancelled'
      ) NOT NULL;
    `);

  }
};
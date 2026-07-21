"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS before_product_delete;
    `);
  },

  async down(queryInterface) {
    // Nothing to restore
  },
};
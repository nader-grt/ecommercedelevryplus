"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
     CREATE TRIGGER before_variant_update
      BEFORE UPDATE ON Variants
      FOR EACH ROW
      BEGIN

        -- No validation needed

      END;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS before_variant_update;
    `);
  },
};
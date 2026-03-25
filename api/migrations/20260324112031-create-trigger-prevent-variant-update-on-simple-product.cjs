"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER before_variant_update
      BEFORE UPDATE ON Variants
      FOR EACH ROW
      BEGIN
        DECLARE productType VARCHAR(10);

        SELECT type INTO productType
        FROM Products
        WHERE id = NEW.productId;

        IF productType = 'SIMPLE' THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Cannot update variant for SIMPLE product';
        END IF;

      END;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS before_variant_update;
    `);
  },
};
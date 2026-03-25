"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER before_product_update
      BEFORE UPDATE ON Products
      FOR EACH ROW
      BEGIN
        DECLARE variantCount INT;

        IF NEW.type = 'SIMPLE' AND OLD.type = 'VARIABLE' THEN

          SELECT COUNT(*) INTO variantCount
          FROM Variants
          WHERE productId = OLD.id;

          IF variantCount > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot change VARIABLE product to SIMPLE while variants exist';
          END IF;

        END IF;

      END;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS before_product_update;
    `);
  },
};
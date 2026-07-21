"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER before_product_update
      BEFORE UPDATE ON Products
      FOR EACH ROW
      BEGIN

        DECLARE variantCount INT;

        IF OLD.type = 'VARIABLE'
           AND NEW.type = 'SIMPLE' THEN

            SELECT COUNT(*)
            INTO variantCount
            FROM Variants
            WHERE productId = OLD.id
              AND isDeleted = 0;

            IF variantCount > 1 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Cannot convert VARIABLE product to SIMPLE while multiple variants exist';
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
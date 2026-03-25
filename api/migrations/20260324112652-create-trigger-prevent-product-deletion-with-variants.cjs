"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER before_product_delete
      BEFORE DELETE ON Products
      FOR EACH ROW
      BEGIN
        DECLARE variantCount INT;

        SELECT COUNT(*) INTO variantCount
        FROM Variants
        WHERE productId = OLD.id;

        IF variantCount > 0 THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Cannot delete product with existing variants';
        END IF;

      END;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS before_product_delete;
    `);
  },
};
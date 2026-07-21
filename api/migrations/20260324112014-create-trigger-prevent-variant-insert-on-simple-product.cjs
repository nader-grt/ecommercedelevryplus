"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
     CREATE TRIGGER before_variant_insert
BEFORE INSERT ON Variants
FOR EACH ROW
BEGIN

    DECLARE productType VARCHAR(10);
    DECLARE productExists INT;
    DECLARE variantCount INT;

    SELECT COUNT(*)
    INTO productExists
    FROM Products
    WHERE id = NEW.productId;

    IF productExists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Product does not exist';
    END IF;

    SELECT type
    INTO productType
    FROM Products
    WHERE id = NEW.productId;

    SELECT COUNT(*)
    INTO variantCount
    FROM Variants
    WHERE productId = NEW.productId
      AND isDeleted = 0;

    IF productType = 'SIMPLE'
       AND variantCount >= 1 THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'SIMPLE product can have only one variant';

    END IF;

END;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS before_variant_insert;
    `);
  },
};
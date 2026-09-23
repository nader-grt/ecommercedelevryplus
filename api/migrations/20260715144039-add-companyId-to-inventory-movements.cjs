"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    // Check if companyId already exists
    const [columns] = await queryInterface.sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'InventoryMovements'
        AND COLUMN_NAME = 'companyId';
    `);

    // Add companyId only if it does not exist
    if (columns.length === 0) {
      await queryInterface.addColumn(
        "InventoryMovements",
        "companyId",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      );
    }

    // Check if the foreign key already exists
    const [constraints] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'InventoryMovements'
        AND CONSTRAINT_NAME = 'fk_inventory_movements_company';
    `);

    // Add foreign key only if it does not exist
    if (constraints.length === 0) {
      await queryInterface.addConstraint(
        "InventoryMovements",
        {
          fields: ["companyId"],
          type: "foreign key",
          name: "fk_inventory_movements_company",
          references: {
            table: "Companies",
            field: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        }
      );
    }
  },

  async down(queryInterface) {

    // Check if the foreign key exists
    const [constraints] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'InventoryMovements'
        AND CONSTRAINT_NAME = 'fk_inventory_movements_company';
    `);

    if (constraints.length > 0) {
      await queryInterface.removeConstraint(
        "InventoryMovements",
        "fk_inventory_movements_company"
      );
    }

    // Check if companyId exists
    const [columns] = await queryInterface.sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'InventoryMovements'
        AND COLUMN_NAME = 'companyId';
    `);

    if (columns.length > 0) {
      await queryInterface.removeColumn(
        "InventoryMovements",
        "companyId"
      );
    }
  },
};

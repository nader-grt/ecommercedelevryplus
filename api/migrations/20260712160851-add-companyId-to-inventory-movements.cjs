'use strict';

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

    // Add companyId only if it does not already exist
    if (columns.length === 0) {
      await queryInterface.addColumn(
        'InventoryMovements',
        'companyId',
        {
          type: Sequelize.INTEGER,
          allowNull: true
        }
      );
    }

    // Backfill companyId from Inventories
    await queryInterface.sequelize.query(`
      UPDATE InventoryMovements im
      JOIN Inventories i
        ON im.variantId = i.variantId
       AND im.warehouseId = i.warehouseId
      SET im.companyId = i.companyId
      WHERE im.companyId IS NULL;
    `);

    // Make companyId NOT NULL
    await queryInterface.changeColumn(
      'InventoryMovements',
      'companyId',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    );

    // Check if the foreign key already exists
    const [constraints] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'InventoryMovements'
        AND CONSTRAINT_NAME = 'fk_inventory_movements_company';
    `);

    // Add FK only if it does not already exist
    if (constraints.length === 0) {
      await queryInterface.addConstraint(
        'InventoryMovements',
        {
          fields: ['companyId'],
          type: 'foreign key',
          name: 'fk_inventory_movements_company',
          references: {
            table: 'Companies',
            field: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        }
      );
    }
  },

  async down(queryInterface) {

    // Remove FK if it exists
    const [constraints] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'InventoryMovements'
        AND CONSTRAINT_NAME = 'fk_inventory_movements_company';
    `);

    if (constraints.length > 0) {
      await queryInterface.removeConstraint(
        'InventoryMovements',
        'fk_inventory_movements_company'
      );
    }

    // Remove companyId if it exists
    const [columns] = await queryInterface.sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'InventoryMovements'
        AND COLUMN_NAME = 'companyId';
    `);

    if (columns.length > 0) {
      await queryInterface.removeColumn(
        'InventoryMovements',
        'companyId'
      );
    }
  }
};

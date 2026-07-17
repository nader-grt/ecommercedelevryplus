'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // =========================
    // companyId
    // =========================
    await queryInterface.addColumn(
      'InventoryReservations',
      'companyId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      }
    );

    // =========================
    // inventoryId
    // =========================
    await queryInterface.addColumn(
      'InventoryReservations',
      'inventoryId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Inventories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      }
    );

    // =========================
    // Indexes
    // =========================
    await queryInterface.addIndex(
      'InventoryReservations',
      ['companyId'],
      {
        name: 'idx_inventory_reservations_company',
      }
    );

    await queryInterface.addIndex(
      'InventoryReservations',
      ['inventoryId'],
      {
        name: 'idx_inventory_reservations_inventory',
      }
    );

    await queryInterface.addIndex(
      'InventoryReservations',
      ['companyId', 'inventoryId'],
      {
        name: 'idx_inventory_reservations_company_inventory',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      'InventoryReservations',
      'idx_inventory_reservations_company_inventory'
    );

    await queryInterface.removeIndex(
      'InventoryReservations',
      'idx_inventory_reservations_inventory'
    );

    await queryInterface.removeIndex(
      'InventoryReservations',
      'idx_inventory_reservations_company'
    );

    await queryInterface.removeColumn(
      'InventoryReservations',
      'inventoryId'
    );

    await queryInterface.removeColumn(
      'InventoryReservations',
      'companyId'
    );
  },
};
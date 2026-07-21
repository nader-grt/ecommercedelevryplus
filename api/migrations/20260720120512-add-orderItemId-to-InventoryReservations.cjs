'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('InventoryReservations', 'orderItemId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: 'orderId',
      references: {
        model: 'OrderItems',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('InventoryReservations', ['orderItemId'], {
      name: 'idx_inventory_reservations_order_item_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'InventoryReservations',
      'idx_inventory_reservations_order_item_id'
    );

    await queryInterface.removeColumn(
      'InventoryReservations',
      'orderItemId'
    );
  },
};
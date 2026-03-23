'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const table = await queryInterface.describeTable('Orders');

    // 🟢 rename ONLY if needed
    if (table.userId && !table.customerId) {
      await queryInterface.renameColumn(
        'Orders',
        'userId',
        'customerId'
      );
    }

    // 🟢 add totalAmount only if not exists
    if (!table.totalAmount) {
      await queryInterface.addColumn('Orders', 'totalAmount', {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      });
    }

    // 🟢 add status only if not exists
    if (!table.status) {
      await queryInterface.addColumn('Orders', 'status', {
        type: Sequelize.ENUM(
          'pending',
          'paid',
          'shipped',
          'delivered',
          'cancelled'
        ),
        allowNull: false,
        defaultValue: 'pending',
      });
    }
  },

  async down(queryInterface, Sequelize) {

    const table = await queryInterface.describeTable('Orders');

    if (table.status) {
      await queryInterface.removeColumn('Orders', 'status');
    }

    if (table.totalAmount) {
      await queryInterface.removeColumn('Orders', 'totalAmount');
    }

    // reverse rename safely
    if (table.customerId && !table.userId) {
      await queryInterface.renameColumn(
        'Orders',
        'customerId',
        'userId'
      );
    }
  },
};
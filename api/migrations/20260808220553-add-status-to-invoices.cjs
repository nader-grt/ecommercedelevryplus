'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Invoices', 'status', {
      type: Sequelize.ENUM(
        'DRAFT',
        'ISSUED',
        'CANCELLED'
      ),
      allowNull: false,
      defaultValue: 'DRAFT',
      after: 'invoiceNumber',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Invoices', 'status');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Invoices_status";'
    );
  },
};
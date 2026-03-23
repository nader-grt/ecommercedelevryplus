'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // 1. companyId (owner of order)
    await queryInterface.addColumn('Orders', 'companyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // 2. buyerCompanyId (B2B buyer)
    await queryInterface.addColumn('Orders', 'buyerCompanyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // 3. supplierCompanyId (seller)
    await queryInterface.addColumn('Orders', 'supplierCompanyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // 4. type (B2C / B2B)
    await queryInterface.addColumn('Orders', 'type', {
      type: Sequelize.ENUM('B2C', 'B2B'),
      allowNull: false,
      defaultValue: 'B2C',
    });

    // 5. index for performance (IMPORTANT for ACID & scaling)
    await queryInterface.addIndex('Orders', ['buyerCompanyId']);
    await queryInterface.addIndex('Orders', ['supplierCompanyId']);
    await queryInterface.addIndex('Orders', ['companyId']);
    await queryInterface.addIndex('Orders', ['type']);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeIndex('Orders', ['buyerCompanyId']);
    await queryInterface.removeIndex('Orders', ['supplierCompanyId']);
    await queryInterface.removeIndex('Orders', ['companyId']);
    await queryInterface.removeIndex('Orders', ['type']);

    await queryInterface.removeColumn('Orders', 'type');
    await queryInterface.removeColumn('Orders', 'supplierCompanyId');
    await queryInterface.removeColumn('Orders', 'buyerCompanyId');
    await queryInterface.removeColumn('Orders', 'companyId');

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Orders_type";');
  }
};
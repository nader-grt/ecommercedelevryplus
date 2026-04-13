'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // 1. add column
    await queryInterface.addColumn('OrderItems', 'variantId', {
      type: Sequelize.INTEGER,
      allowNull: true, // في البداية nullable
      after: 'productId' // optional (تنظيم فقط)
    });

  
    await queryInterface.addIndex('OrderItems', ['variantId'], {
      name: 'idx_orderitems_variantId'
    });

    // 3. add foreign key
    await queryInterface.addConstraint('OrderItems', {
      fields: ['variantId'],
      type: 'foreign key',
      name: 'fk_orderitems_variant', // 
      references: {
        table: 'Variants',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

  },

  async down(queryInterface, Sequelize) {

    // 1. remove FK
    await queryInterface.removeConstraint('OrderItems', 'fk_orderitems_variant');

    // 2. remove index
    await queryInterface.removeIndex('OrderItems', 'idx_orderitems_variantId');

    // 3. remove column
    await queryInterface.removeColumn('OrderItems', 'variantId');

  }
};
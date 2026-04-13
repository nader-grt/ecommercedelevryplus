'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VariantAttributes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      variantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Variants',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 🔥 index (performance)
    await queryInterface.addIndex('VariantAttributes', ['variantId']);

    // 🔥 UNIQUE CONSTRAINT (الأهم)
    await queryInterface.addConstraint('VariantAttributes', {
      fields: ['variantId', 'name'],
      type: 'unique',
      name: 'unique_variant_attribute',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('VariantAttributes');
  },
};
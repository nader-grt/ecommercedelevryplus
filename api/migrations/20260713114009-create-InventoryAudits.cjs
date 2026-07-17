'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InventoryAudits', {
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Warehouses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      systemQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      actualQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      difference: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      reason: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Indexes
    await queryInterface.addIndex('InventoryAudits', ['variantId']);
    await queryInterface.addIndex('InventoryAudits', ['warehouseId']);
    await queryInterface.addIndex('InventoryAudits', ['userId']);
    await queryInterface.addIndex('InventoryAudits', ['createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('InventoryAudits');
  },
};
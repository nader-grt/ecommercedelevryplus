'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RetailShops', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },

      address: {
        type: Sequelize.STRING,
        allowNull: true
      },

      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },

      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },

      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RetailShops');
  }
};
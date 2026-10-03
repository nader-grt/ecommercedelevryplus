'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CompanySettings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'TND',
      },

      language: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'fr',
      },

      timezone: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Africa/Tunis',
      },

      taxRate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },

      logoCompany: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      addressCompany: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      phoneCompany: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      emailCompany: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      updatedBy: {
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('CompanySettings');
  },
};
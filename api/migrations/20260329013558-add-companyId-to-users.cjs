'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'companyId', {
      type: Sequelize.INTEGER,
      allowNull: true, // مهم في البداية
      references: {
        model: 'Companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'companyId');
  },
};
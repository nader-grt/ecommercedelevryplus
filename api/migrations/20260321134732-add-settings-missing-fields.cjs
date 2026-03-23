'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // 🏢 Multi-tenant support
    // await queryInterface.addColumn('Settings', 'companyId', {
    //   type: Sequelize.INTEGER,
    //   allowNull: true, // خليه true إذا عندك بيانات قديمة
    // });

    // 🌍 System settings
    await queryInterface.addColumn('Settings', 'currency', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'USD',
    });

    await queryInterface.addColumn('Settings', 'language', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'en',
    });

    await queryInterface.addColumn('Settings', 'timezone', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'UTC',
    });

    await queryInterface.addColumn('Settings', 'taxRate', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });

    // ⚙️ status control
    await queryInterface.addColumn('Settings', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    // 🔐 audit fields
    await queryInterface.addColumn('Settings', 'createdBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('Settings', 'updatedBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // 🚀 index for performance (important for SaaS)
   // await queryInterface.addIndex('Settings', ['companyId']);
  },

  async down(queryInterface, Sequelize) {

   // await queryInterface.removeIndex('Settings', ['companyId']);

   // await queryInterface.removeColumn('Settings', 'companyId');
    await queryInterface.removeColumn('Settings', 'currency');
    await queryInterface.removeColumn('Settings', 'language');
    await queryInterface.removeColumn('Settings', 'timezone');
    await queryInterface.removeColumn('Settings', 'taxRate');
    await queryInterface.removeColumn('Settings', 'isActive');
    await queryInterface.removeColumn('Settings', 'createdBy');
    await queryInterface.removeColumn('Settings', 'updatedBy');
  }
};
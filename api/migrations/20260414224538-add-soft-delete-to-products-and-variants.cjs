'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ===============================
    // 🔹 PRODUCTS
    // ===============================
    await queryInterface.addColumn('Products', 'isDeleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // ===============================
    // 🔹 VARIANTS (BONUS)
    // ===============================
    await queryInterface.addColumn('Variants', 'isDeleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // ===============================
    // 🔹 VARIANTS
    // ===============================
    await queryInterface.removeColumn('Variants', 'isDeleted');

    // ===============================
    // 🔹 PRODUCTS
    // ===============================
    await queryInterface.removeColumn('Products', 'isDeleted');
  },
};
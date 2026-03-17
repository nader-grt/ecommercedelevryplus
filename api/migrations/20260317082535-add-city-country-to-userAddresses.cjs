"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add 'country' column (optional, default 'Tunis')
    await queryInterface.addColumn("userAddresses", "country", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "Tunis",
    });

    // Add 'city' column (required)
    await queryInterface.addColumn("userAddresses", "city", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("userAddresses", "city");
    await queryInterface.removeColumn("userAddresses", "country");
  },
};
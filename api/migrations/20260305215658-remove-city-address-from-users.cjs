"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    const table = await queryInterface.describeTable("Users");

    if (table.city) {
      await queryInterface.removeColumn("Users", "city");
    }

    if (table.address) {
      await queryInterface.removeColumn("Users", "address");
    }
  },

  async down(queryInterface, Sequelize) {

    const table = await queryInterface.describeTable("Users");

    if (!table.city) {
      await queryInterface.addColumn("Users", "city", {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }

    if (!table.address) {
      await queryInterface.addColumn("Users", "address", {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
  },
};
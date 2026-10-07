'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "role", {
      type: Sequelize.ENUM(
        "SUPERADMIN",
        "ADMIN",
        "USER",
        "SUPPLIER",
        "DELIVERER",
        "SECRTRIE",
        "OWNER"
      ),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "role", {
      type: Sequelize.ENUM(
        "ADMIN",
        "USER",
        "SUPPLIER",
        "DELIVERER",
        "SECRTRIE",
        "OWNER"
      ),
      allowNull: false,
    });
  }
};

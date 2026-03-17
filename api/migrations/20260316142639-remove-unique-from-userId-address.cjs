"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("userAddresses", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      // no unique here
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("userAddresses", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true, //
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
};
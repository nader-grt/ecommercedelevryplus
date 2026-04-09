'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable("Discounts", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    type: {
      type: Sequelize.ENUM("PERCENT", "FIXED"),
      allowNull: false,
    },

    value: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },

    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    endDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Discounts");
  }
};

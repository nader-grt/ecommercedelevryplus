"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {


    await queryInterface.removeConstraint("userAddresses", "userAddresses_ibfk_1");
    await queryInterface.removeConstraint("userAddresses", "userAddresses_ibfk_2");


    await queryInterface.removeIndex("userAddresses", "userId");


    await queryInterface.addConstraint("userAddresses", {
      fields: ["userId"],
      type: "foreign key",
      name: "userAddresses_userId_fk",
      references: {
        table: "Users",
        field: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });

  
    await queryInterface.addColumn("userAddresses", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    });

    await queryInterface.addColumn("userAddresses", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    });

  },

  async down(queryInterface, Sequelize) {


    await queryInterface.removeColumn("userAddresses", "createdAt");
    await queryInterface.removeColumn("userAddresses", "updatedAt");

  
    await queryInterface.removeConstraint("userAddresses", "userAddresses_userId_fk");

 
    await queryInterface.addConstraint("userAddresses", {
      fields: ["userId"],
      type: "unique",
      name: "userId"
    });

 
    await queryInterface.addConstraint("userAddresses", {
      fields: ["userId"],
      type: "foreign key",
      name: "userAddresses_ibfk_1",
      references: {
        table: "Users",
        field: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });

  }
};
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "accountStatus", {
      type: Sequelize.ENUM("INVITED", "ACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Users", "accountStatus");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Users_accountStatus";'
    );
  },
};

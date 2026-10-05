"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Allow invited users to have no password yet
    await queryInterface.changeColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // 2. Protect the database:
    // ACTIVE users must always have a password
    await queryInterface.sequelize.query(`
      CREATE TRIGGER users_active_password_insert
      BEFORE INSERT ON Users
      FOR EACH ROW
      BEGIN
        IF NEW.accountStatus = 'ACTIVE'
           AND NEW.password IS NULL THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'ACTIVE user must have a password';
        END IF;
      END
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER users_active_password_update
      BEFORE UPDATE ON Users
      FOR EACH ROW
      BEGIN
        IF NEW.accountStatus = 'ACTIVE'
           AND NEW.password IS NULL THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'ACTIVE user must have a password';
        END IF;
      END
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remove triggers first
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS users_active_password_insert
    `);

    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS users_active_password_update
    `);

    // Restore the original constraint
    await queryInterface.changeColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
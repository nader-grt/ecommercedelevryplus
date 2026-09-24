"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER chk_superadmin_company_insert
      BEFORE INSERT ON Users
      FOR EACH ROW
      BEGIN
        IF NEW.role = 'SUPERADMIN' AND NEW.companyId IS NOT NULL THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'SUPERADMIN must have companyId = NULL';
        END IF;
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER chk_superadmin_company_update
      BEFORE UPDATE ON Users
      FOR EACH ROW
      BEGIN
        IF NEW.role = 'SUPERADMIN' AND NEW.companyId IS NOT NULL THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'SUPERADMIN must have companyId = NULL';
        END IF;
      END;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS chk_superadmin_company_insert;
    `);

    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS chk_superadmin_company_update;
    `);
  },
};

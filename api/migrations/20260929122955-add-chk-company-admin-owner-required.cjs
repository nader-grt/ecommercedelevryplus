"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER chk_company_required_insert
      BEFORE INSERT ON Users
      FOR EACH ROW
      BEGIN
        IF NEW.role IN ('ADMIN','OWNER') AND NEW.companyId IS NULL THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'ADMIN and OWNER must belong to a company';
        END IF;
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER chk_company_required_update
      BEFORE UPDATE ON Users
      FOR EACH ROW
      BEGIN
        IF NEW.role IN ('ADMIN','OWNER') AND NEW.companyId IS NULL THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'ADMIN and OWNER must belong to a company';
        END IF;
      END;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS chk_company_required_insert;"
    );
    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS chk_company_required_update;"
    );
  },
};
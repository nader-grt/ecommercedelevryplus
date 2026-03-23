'use strict';

module.exports = {
  async up(queryInterface) {

    // 🛡️ safe drop before create
    await queryInterface.sequelize.query(`
      DROP VIEW IF EXISTS vw_deliverer_dayworks;
    `);

    // create view safely
    await queryInterface.sequelize.query(`
      CREATE VIEW vw_deliverer_dayworks AS
      SELECT
        u.id AS user_id,
        CONCAT(u.firstName, ' ', u.lastName) AS full_name,
        e.salary,
        d.id AS deliverer_id,
        d.carType,
        dw.nameDay
      FROM Users u
      JOIN Employees e ON u.id = e.userId
      JOIN deliverers d ON d.employeeId = e.id
      JOIN deliverer_dayWorks ddw ON ddw.delivererid = d.id
      JOIN dayWorks dw ON ddw.dayWorkid = dw.id;
    `);

  },

  async down(queryInterface) {

    await queryInterface.sequelize.query(`
      DROP VIEW IF EXISTS vw_deliverer_dayworks;
    `);

  }
};
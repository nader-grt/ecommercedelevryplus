'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    // 🛡️ always safe drop first
    await queryInterface.sequelize.query(`
      DROP VIEW IF EXISTS view_deliverer_work_days;
    `);

    await queryInterface.sequelize.query(`
      CREATE VIEW view_deliverer_work_days AS
      SELECT    
        deliverer_dayWorks.id AS TDelDayWorksMiddleId, 
        Users.id AS TusersId,
        CONCAT(Users.firstName, ' ', Users.lastName) AS FullName,
        Users.role AS UserIsRole,
        dayWorks.nameDay AS DayOfWorkDelivery,
        IFNULL(deliverer_dayWorks.nbrHours, 0) AS DeliveryNbrHours,
        Employees.salary AS SalaryEmpIsDelivery,
        deliverers.id AS TdeliD,
        deliverers.carType AS TdelcarType
      FROM dayWorks
      LEFT JOIN deliverer_dayWorks 
        ON dayWorks.id = deliverer_dayWorks.dayWorkid
      LEFT JOIN deliverers 
        ON deliverers.id = deliverer_dayWorks.delivererid
      LEFT JOIN Employees    
        ON Employees.id = deliverers.employeeId
      LEFT JOIN Users 
        ON Users.id = Employees.userId
        AND Users.role = 'deliverer';
    `);

  },

  async down(queryInterface) {

    await queryInterface.sequelize.query(`
      DROP VIEW IF EXISTS view_deliverer_work_days;
    `);

  }
};
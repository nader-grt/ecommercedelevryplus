'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE Users 
      MODIFY role ENUM(
        'user',
        'admin',
        'supplier',
        'deliverer',
        'secrtrie',
        'OWNER'
      ) NOT NULL DEFAULT 'user';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE Users 
      MODIFY role ENUM(
        'user',
        'admin',
        'supplier',
        'deliverer',
        'secrtrie'
      ) NOT NULL DEFAULT 'user';
    `);
  },
};
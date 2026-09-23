'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {
    const [results] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'Inventories'
        AND CONSTRAINT_NAME = 'fk_inventories_company'
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    `);

    if (results.length === 0) {
      await queryInterface.addConstraint(
        'Inventories',
        {
          fields: ['companyId'],
          type: 'foreign key',
          name: 'fk_inventories_company',
          references: {
            table: 'Companies',
            field: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
      );
    }
  },

  async down(queryInterface) {
    const [results] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = 'Inventories'
        AND CONSTRAINT_NAME = 'fk_inventories_company'
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    `);

    if (results.length > 0) {
      await queryInterface.removeConstraint(
        'Inventories',
        'fk_inventories_company'
      );
    }
  },

};

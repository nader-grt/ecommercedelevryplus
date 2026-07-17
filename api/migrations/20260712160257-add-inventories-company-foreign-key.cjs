'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.addConstraint(
      'Inventories',
      {
        fields: ['companyId'],

        type: 'foreign key',

        name: 'fk_inventories_company',

        references: {
          table: 'Companies',
          field: 'id'
        },

        onUpdate: 'CASCADE',

        onDelete: 'RESTRICT'
      }
    );

  },


  async down(queryInterface, Sequelize) {

    await queryInterface.removeConstraint(
      'Inventories',
      'fk_inventories_company'
    );

  }

};
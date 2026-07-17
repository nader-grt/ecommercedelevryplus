'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    // Add companyId column
    await queryInterface.addColumn(
      'Inventories',
      'companyId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    );


    // Add Foreign Key
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


    // Prevent duplicate inventory
    await queryInterface.addConstraint(
      'Inventories',
      {
        fields:[
          'companyId',
          'variantId',
          'warehouseId'
        ],

        type:'unique',

        name:
        'unique_company_variant_warehouse'
      }
    );


  },


  async down(queryInterface) {


    await queryInterface.removeConstraint(
      'Inventories',
      'unique_company_variant_warehouse'
    );


    await queryInterface.removeConstraint(
      'Inventories',
      'fk_inventories_company'
    );


    await queryInterface.removeColumn(
      'Inventories',
      'companyId'
    );


  }

};
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      "OrderItems",
      "warehouseId",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );

    await queryInterface.addConstraint(
      "OrderItems",
      {
        fields: ["warehouseId"],
        type: "foreign key",
        name: "fk_orderitems_warehouse",
        references: {
          table: "Warehouses",
          field: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      }
    );

  },

  async down(queryInterface) {

    await queryInterface.removeConstraint(
      "OrderItems",
      "fk_orderitems_warehouse"
    );

    await queryInterface.removeColumn(
      "OrderItems",
      "warehouseId"
    );

  },
};
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      "InventoryMovements",
      "companyId",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );

    await queryInterface.addConstraint(
      "InventoryMovements",
      {
        fields: ["companyId"],
        type: "foreign key",
        name: "fk_inventory_movements_company",
        references: {
          table: "Companies",
          field: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      }
    );

  },

  async down(queryInterface) {

    await queryInterface.removeConstraint(
      "InventoryMovements",
      "fk_inventory_movements_company"
    );

    await queryInterface.removeColumn(
      "InventoryMovements",
      "companyId"
    );

  },
};
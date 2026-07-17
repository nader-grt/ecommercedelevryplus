"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint("Products", {
      fields: ["companyId"],
      type: "foreign key",
      name: "fk_products_company",
      references: {
        table: "Companies",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      "Products",
      "fk_products_company"
    );
  },
};
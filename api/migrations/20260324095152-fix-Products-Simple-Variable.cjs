"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "type", {
      type: Sequelize.ENUM("SIMPLE", "VARIABLE"),
      allowNull: false,
      defaultValue: "SIMPLE",
    });

  
    await queryInterface.sequelize.query(`
      UPDATE Products p
      SET type = 'VARIABLE'
      WHERE EXISTS (
        SELECT 1 FROM Variants v WHERE v.productId = p.id
      )
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "type");
  },
};
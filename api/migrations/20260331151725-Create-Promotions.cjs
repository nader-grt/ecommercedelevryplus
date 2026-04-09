'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.createTable("Promotions", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    conditionType: {
      type: Sequelize.ENUM("MIN_QTY", "PRODUCT", "WAREHOUSE"),
      allowNull: false,
    },

    conditionValue: {
      type: Sequelize.STRING, // flexible (qty / productId / warehouseId)
      allowNull: false,
    },

    discountId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Discounts",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });
     
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Promotions");
  }
};

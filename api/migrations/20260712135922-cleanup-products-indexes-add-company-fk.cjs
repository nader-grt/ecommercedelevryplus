"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // ======================================
      // اقرأ جميع الـ Indexes الموجودة
      // ======================================
      const indexes = await queryInterface.showIndex("Products", {
        transaction,
      });

      // ======================================
      // احذف الـ duplicated indexes
      // name_2, name_3 ...
      // nameImage_2, nameImage_3 ...
      // ======================================
      for (const index of indexes) {
        const name = index.name;

        if (
          /^name_\d+$/.test(name) ||
          /^nameImage_\d+$/.test(name)
        ) {
          console.log("Dropping index:", name);

          await queryInterface.removeIndex("Products", name, {
            transaction,
          });
        }
      }

      // ======================================
      // هل يوجد FK بالفعل؟
      // ======================================
      const [foreignKeys] = await queryInterface.sequelize.query(
        `
        SELECT CONSTRAINT_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE
            TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME='Products'
            AND COLUMN_NAME='companyId'
            AND REFERENCED_TABLE_NAME='Companies'
        `,
        { transaction }
      );

      if (foreignKeys.length === 0) {
        console.log("Creating fk_products_company");

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
          transaction,
        });
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeConstraint(
        "Products",
        "fk_products_company",
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
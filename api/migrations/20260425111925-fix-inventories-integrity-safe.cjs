'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. تنظيف البيانات (NULL → default warehouse)
      await queryInterface.sequelize.query(
        `
        UPDATE Inventories
        SET warehouseId = 1
        WHERE warehouseId IS NULL;
      `,
        { transaction }
      );

      // 2. تعديل warehouseId → NOT NULL
      await queryInterface.changeColumn(
        'Inventories',
        'warehouseId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction }
      );

      // 3. default values
      await queryInterface.changeColumn(
        'Inventories',
        'quantity',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );

      await queryInterface.changeColumn(
        'Inventories',
        'reserved',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );

      // 4. INDEXES
      const indexes = await queryInterface.showIndex('Inventories');

      const hasUnique = indexes.some(
        (i) =>
          i.name === 'unique_variant_warehouse' ||
          i.name === 'inventories_variant_id_warehouse_id'
      );

      if (!hasUnique) {
        await queryInterface.addConstraint('Inventories', {
          fields: ['variantId', 'warehouseId'],
          type: 'unique',
          name: 'unique_variant_warehouse',
          transaction,
        });
      }

      // 5. FOREIGN KEYS (قبل حذف index)
      const constraints =
        await queryInterface.getForeignKeyReferencesForTable(
          'Inventories'
        );

      // ===== warehouse FK =====
      const warehouseFK = constraints.find(
        (c) => c.columnName === 'warehouseId'
      );

      if (warehouseFK && warehouseFK.constraintName) {
        await queryInterface.removeConstraint(
          'Inventories',
          warehouseFK.constraintName,
          { transaction }
        );
      }

      // 6. حذف index الزايد (إذا موجود)
      const indexesAfterFK = await queryInterface.showIndex('Inventories');

      const hasWarehouseIndex = indexesAfterFK.some(
        (i) => i.name === 'warehouseId'
      );

      if (hasWarehouseIndex) {
        await queryInterface.removeIndex(
          'Inventories',
          'warehouseId',
          { transaction }
        );
      }

      // 7. إعادة FK warehouse clean
      const constraintsAfter =
        await queryInterface.getForeignKeyReferencesForTable(
          'Inventories'
        );

      const hasWarehouseFK = constraintsAfter.some(
        (c) => c.constraintName === 'fk_inventory_warehouse'
      );

      if (!hasWarehouseFK) {
        await queryInterface.addConstraint('Inventories', {
          fields: ['warehouseId'],
          type: 'foreign key',
          name: 'fk_inventory_warehouse',
          references: {
            table: 'Warehouses',
            field: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          transaction,
        });
      }

      // ===== variant FK =====
      const hasVariantFK = constraints.some(
        (c) => c.constraintName === 'fk_inventory_variant'
      );

      if (!hasVariantFK) {
        await queryInterface.addConstraint('Inventories', {
          fields: ['variantId'],
          type: 'foreign key',
          name: 'fk_inventory_variant',
          references: {
            table: 'Variants',
            field: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          transaction,
        });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // remove FK (safe)
      const constraints =
        await queryInterface.getForeignKeyReferencesForTable(
          'Inventories'
        );

      for (const fk of constraints) {
        if (
          fk.constraintName === 'fk_inventory_variant' ||
          fk.constraintName === 'fk_inventory_warehouse'
        ) {
          await queryInterface.removeConstraint(
            'Inventories',
            fk.constraintName,
            { transaction }
          );
        }
      }

      // remove UNIQUE (إذا موجود)
      try {
        await queryInterface.removeConstraint(
          'Inventories',
          'unique_variant_warehouse',
          { transaction }
        );
      } catch (e) {}

      // رجع index warehouseId
      await queryInterface.addIndex(
        'Inventories',
        ['warehouseId'],
        {
          name: 'warehouseId',
          transaction,
        }
      );

      // رجع nullable
      await queryInterface.changeColumn(
        'Inventories',
        'warehouseId',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
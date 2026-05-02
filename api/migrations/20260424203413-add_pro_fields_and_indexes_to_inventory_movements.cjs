'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // 1️⃣ type → ENUM (clean & strict)
    await queryInterface.changeColumn('InventoryMovements', 'type', {
      type: Sequelize.ENUM('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER'),
      allowNull: false
    });

    // 2️⃣ userId (audit trail)
    await queryInterface.addColumn('InventoryMovements', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // 3️⃣ note (business explanation)
    await queryInterface.addColumn('InventoryMovements', 'note', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    // 4️⃣ createdAt safety (if missing default behavior)
    await queryInterface.changeColumn('InventoryMovements', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });

    // 5️⃣ INDEXES (performance layer)

    await queryInterface.addIndex('InventoryMovements', ['variantId'], {
      name: 'idx_im_variant'
    });

    await queryInterface.addIndex('InventoryMovements', ['warehouseId'], {
      name: 'idx_im_warehouse'
    });

    await queryInterface.addIndex('InventoryMovements', ['userId'], {
      name: 'idx_im_user'
    });

    await queryInterface.addIndex('InventoryMovements', ['type'], {
      name: 'idx_im_type'
    });

    // 🔥 optional strong index (for real stock queries)
    await queryInterface.addIndex(
      'InventoryMovements',
      ['variantId', 'warehouseId'],
      {
        name: 'idx_im_variant_warehouse'
      }
    );
  },

  async down(queryInterface, Sequelize) {

    // remove indexes
    await queryInterface.removeIndex('InventoryMovements', 'idx_im_variant');
    await queryInterface.removeIndex('InventoryMovements', 'idx_im_warehouse');
    await queryInterface.removeIndex('InventoryMovements', 'idx_im_user');
    await queryInterface.removeIndex('InventoryMovements', 'idx_im_type');
    await queryInterface.removeIndex('InventoryMovements', 'idx_im_variant_warehouse');

    // remove columns
    await queryInterface.removeColumn('InventoryMovements', 'userId');
    await queryInterface.removeColumn('InventoryMovements', 'note');

    // revert type
    await queryInterface.changeColumn('InventoryMovements', 'type', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // drop ENUM (important for MariaDB/MySQL)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_InventoryMovements_type;'
    );
  }
};
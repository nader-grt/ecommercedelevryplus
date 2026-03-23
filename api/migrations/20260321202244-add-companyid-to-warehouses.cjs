module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Warehouses', 'companyId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Warehouses', 'companyId');
  },
};
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('RetailShops', 'companyId', {
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
    await queryInterface.removeColumn('RetailShops', 'companyId');
  },
};
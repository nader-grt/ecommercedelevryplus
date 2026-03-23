'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
   
    // await queryInterface.addColumn('OrderItems', 'productName', {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // });

   
    // await queryInterface.addColumn('OrderItems', 'totalPrice', {
    //   type: Sequelize.DOUBLE,
    //   allowNull: false,
    //   comment: 'Total price for this line: quantity * unitPrice',
    // });

  
    await queryInterface.addIndex('OrderItems', ['orderId', 'productId'], {
      unique: true,
      name: 'order_product_unique',
    });
  },

  async down(queryInterface, Sequelize) {
  
    await queryInterface.removeIndex('OrderItems', 'order_product_unique');
  //  await queryInterface.removeColumn('OrderItems', 'totalPrice');
   // await queryInterface.removeColumn('OrderItems', 'productName');
  },
};

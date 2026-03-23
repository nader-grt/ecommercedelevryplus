'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const indexes = await queryInterface.showIndex('Users');

    const exists = indexes.some(
      i => i.name === 'users_email_unique'
    );

    if (!exists) {
      await queryInterface.addIndex('Users', ['email'], {
        unique: true,
        name: 'users_email_unique',
      });
    }

  },

  async down(queryInterface, Sequelize) {

    const indexes = await queryInterface.showIndex('Users');

    const exists = indexes.some(
      i => i.name === 'users_email_unique'
    );

    if (exists) {
      await queryInterface.removeIndex('Users', 'users_email_unique');
    }

  },
};
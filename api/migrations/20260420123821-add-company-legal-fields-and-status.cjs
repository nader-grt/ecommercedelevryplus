module.exports = {
  up: async (queryInterface) => {

    await queryInterface.sequelize.query(`
      ALTER TABLE Companies
      ADD COLUMN trade_name VARCHAR(255) NULL,
      ADD COLUMN tax_number VARCHAR(100) NULL,
      ADD COLUMN registration_number VARCHAR(100) NULL,
      ADD COLUMN status ENUM('ACTIVE','SUSPENDED','DELETED') NULL;
    `);

    await queryInterface.sequelize.query(`
      UPDATE Companies
      SET status = CASE 
        WHEN isActive = 1 THEN 'ACTIVE'
        WHEN isActive = 0 THEN 'SUSPENDED'
        ELSE 'ACTIVE'
      END;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Companies
      MODIFY status ENUM('ACTIVE','SUSPENDED','DELETED') NOT NULL DEFAULT 'ACTIVE';
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Companies
      DROP COLUMN isActive;
    `);
  },

  down: async (queryInterface) => {

    await queryInterface.sequelize.query(`
      ALTER TABLE Companies
      ADD COLUMN isActive TINYINT(1) DEFAULT 1;
    `);

    await queryInterface.sequelize.query(`
      UPDATE Companies
      SET isActive = CASE 
        WHEN status = 'ACTIVE' THEN 1
        ELSE 0
      END;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Companies
      DROP COLUMN trade_name,
      DROP COLUMN tax_number,
      DROP COLUMN registration_number,
      DROP COLUMN status;
    `);
  }
};
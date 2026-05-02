module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER before_update_owner
      BEFORE UPDATE ON Users
      FOR EACH ROW
      BEGIN
        IF NEW.role = 'OWNER' THEN
          IF EXISTS (
            SELECT 1 FROM Users
            WHERE companyId = NEW.companyId
            AND role = 'OWNER'
            AND id != NEW.id
          ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'This company already has an owner';
          END IF;
        END IF;
      END;
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS before_update_owner;
    `);
  }
};
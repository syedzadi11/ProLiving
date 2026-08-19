'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('listings', {
      listing_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      area: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      room_type: {
        type: Sequelize.ENUM('Single Room', 'Shared Room', 'Full Apartment'),
        allowNull: false
      },
      monthly_rent: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Active', 'Rented', 'Expired'),
        allowNull: false,
        defaultValue: 'Active'
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('listings', ['status', 'expiry_date'], { name: 'idx_status_expiry' });
    await queryInterface.addIndex('listings', ['city', 'area'], { name: 'idx_city_area' });
    await queryInterface.addIndex('listings', ['room_type'], { name: 'idx_room_type' });
    await queryInterface.addIndex('listings', ['monthly_rent'], { name: 'idx_monthly_rent' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('listings');
  }
};
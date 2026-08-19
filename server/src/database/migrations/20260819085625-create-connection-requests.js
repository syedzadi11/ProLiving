'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('connection_requests', {
      connection_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      listing_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'listings', key: 'listing_id' },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE'
      },
      message: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Accepted', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending'
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

    await queryInterface.addIndex('connection_requests', ['listing_id', 'user_id'], {
      name: 'uq_listing_sender',
      unique: true
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('connection_requests');
  }
};
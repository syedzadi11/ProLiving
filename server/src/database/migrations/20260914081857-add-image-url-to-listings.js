'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('listings', 'image_url', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('listings', 'image_url');
  }
};
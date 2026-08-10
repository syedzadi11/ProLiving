const { REQUEST_STATUS } = require('../utils/enums');

module.exports = (sequelize, DataTypes) => {
  const ConnectionRequest = sequelize.define('ConnectionRequest', {
    connection_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    listing_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM(...REQUEST_STATUS),
      allowNull: false,
      defaultValue: 'Pending'
    }
  }, {
    tableName: 'connection_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    indexes: [
      {
        unique: true,
        fields: ['listing_id', 'user_id']
      }
    ]
  });

  ConnectionRequest.associate = (models) => {
    ConnectionRequest.belongsTo(models.Listing, { foreignKey: 'listing_id' });
    ConnectionRequest.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return ConnectionRequest;
};
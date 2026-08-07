module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define('Listing', {
    listing_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    area: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    room_type: {
      type: DataTypes.ENUM('Single Room', 'Shared Room', 'Full Apartment'),
      allowNull: false
    },
    monthly_rent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 }   // rental amount > 0 (mentor's requirement)
    },
    status: {
      type: DataTypes.ENUM('Active', 'Rented', 'Expired'),
      allowNull: false,
      defaultValue: 'Active'
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'listings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Listing.associate = (models) => {
    Listing.belongsTo(models.User, { foreignKey: 'user_id' });
    Listing.hasMany(models.ConnectionRequest, { foreignKey: 'listing_id' });
  };

  return Listing;
};
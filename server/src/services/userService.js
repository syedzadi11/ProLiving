


const { User, Listing, ConnectionRequest, sequelize } = require('../database/models');
const { Op } = require('sequelize');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const fs = require('fs');
const path = require('path');

const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

const updateProfile = async (userId, data, profilePhotoUrl) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const updateData = { ...data };

  if (profilePhotoUrl) {
    if (user.profile_photo) {
      const oldPhotoPath = path.join(__dirname, '../../uploads', user.profile_photo.replace('/uploads/', ''));
      fs.unlink(oldPhotoPath, (err) => {
        if (err) console.error('Could not delete old profile photo:', err.message);
      });
    }
    updateData.profile_photo = profilePhotoUrl;
  }

  await user.update(updateData);

  const { password: _, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  const hashedPassword = await hashPassword(newPassword);
  await user.update({ password: hashedPassword });
};

const deleteAccount = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const transaction = await sequelize.transaction();

  try {
    // Find all of this user's listings first, so we know which listing_ids to clean up
    const userListings = await Listing.findAll({
      where: { user_id: userId },
      attributes: ['listing_id'],
      transaction
    });
    const listingIds = userListings.map((l) => l.listing_id);

    // Delete connection requests where the user is the sender,
    // OR the request belongs to one of the user's own listings
    await ConnectionRequest.destroy({
      where: {
        [Op.or]: [
          { user_id: userId },
          { listing_id: listingIds }
        ]
      },
      transaction
    });

    // Delete the user's listings
    await Listing.destroy({
      where: { user_id: userId },
      transaction
    });

    // Clean up the user's profile photo file, if any
    if (user.profile_photo) {
      const photoPath = path.join(__dirname, '../../uploads', user.profile_photo.replace('/uploads/', ''));
      fs.unlink(photoPath, (err) => {
        if (err) console.error('Could not delete profile photo:', err.message);
      });
    }

    // Finally, delete the user itself
    await user.destroy({ transaction });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
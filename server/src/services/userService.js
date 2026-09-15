const { User } = require('../database/models');
const NotFoundError = require('../errors/NotFoundError');
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

module.exports = { getProfile, updateProfile };
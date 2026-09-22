

const Joi = require('joi');

const updateProfileSchema = Joi.object({
  full_name: Joi.string().min(2).max(100),
  phone: Joi.string().min(7).max(20),
  city: Joi.string().min(2).max(100)
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(8).required()
});

module.exports = { updateProfileSchema, changePasswordSchema };
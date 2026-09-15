const Joi = require('joi');

const updateProfileSchema = Joi.object({
  full_name: Joi.string().min(2).max(100),
  phone: Joi.string().min(7).max(20),
  city: Joi.string().min(2).max(100)
});

module.exports = { updateProfileSchema };
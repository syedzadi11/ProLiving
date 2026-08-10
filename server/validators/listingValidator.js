const Joi = require('joi');

const createListingSchema = Joi.object({
  title: Joi.string().min(3).max(150).required(),
  description: Joi.string().allow('', null),
  city: Joi.string().required(),
  area: Joi.string().required(),
  room_type: Joi.string().valid('Single Room', 'Shared Room', 'Full Apartment').required(),
  monthly_rent: Joi.number().positive().required()
});

const updateListingSchema = Joi.object({
  title: Joi.string().min(3).max(150),
  description: Joi.string().allow('', null),
  city: Joi.string(),
  area: Joi.string(),
  room_type: Joi.string().valid('Single Room', 'Shared Room', 'Full Apartment'),
  monthly_rent: Joi.number().positive()
});

module.exports = { createListingSchema, updateListingSchema };
const Joi = require('joi');
const { ROOM_TYPES } = require('../utils/enums');

const createListingSchema = Joi.object({
  title: Joi.string().min(3).max(150).required(),
  description: Joi.string().allow('', null),
  city: Joi.string().required(),
  area: Joi.string().required(),
  room_type: Joi.string().valid(...ROOM_TYPES).required(),
  monthly_rent: Joi.number().positive().required()
});

const updateListingSchema = Joi.object({
  title: Joi.string().min(3).max(150),
  description: Joi.string().allow('', null),
  city: Joi.string(),
  area: Joi.string(),
  room_type: Joi.string().valid(...ROOM_TYPES),
  monthly_rent: Joi.number().positive()
});

module.exports = { createListingSchema, updateListingSchema };
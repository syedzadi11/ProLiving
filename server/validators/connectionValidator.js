const Joi = require('joi');

const sendRequestSchema = Joi.object({
  listing_id: Joi.number().integer().required(),
  message: Joi.string().allow('', null).max(500)
});

const decisionSchema = Joi.object({
  decision: Joi.string().valid('Accepted', 'Rejected').required()
});

module.exports = { sendRequestSchema, decisionSchema };
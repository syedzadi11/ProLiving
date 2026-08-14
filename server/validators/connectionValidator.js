const Joi = require('joi');


const REQUEST_STATUS = require('../enums/request-status.enum');

const sendRequestSchema = Joi.object({
  listing_id: Joi.number().integer().required(),
  message: Joi.string().allow('', null).max(500)
});

// Only Accepted/Rejected are valid manual decisions (never 'Pending')
const decisionSchema = Joi.object({
  decision: Joi.string().valid(...REQUEST_STATUS.filter(s => s !== 'Pending')).required()
});

module.exports = { sendRequestSchema, decisionSchema };
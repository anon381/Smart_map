const Joi = require('joi');

const createAdSchema = Joi.object({
  title: Joi.string().min(3).max(120).required(),
  description: Joi.string().max(500).allow('', null),
  imageUrl: Joi.string().uri().allow('', null),
  targetUrl: Joi.string().uri().required(),
  placement: Joi.string().max(50).required(),
  status: Joi.string().valid('ACTIVE', 'PAUSED', 'INACTIVE').default('ACTIVE'),
  priority: Joi.number().integer().min(0).default(0),
  startAt: Joi.date().iso().optional().allow(null),
  endAt: Joi.date().iso().optional().allow(null),
});

const updateAdSchema = createAdSchema.fork(['title', 'targetUrl', 'placement'], (schema) => schema.optional());

module.exports = {
  createAdSchema,
  updateAdSchema,
};

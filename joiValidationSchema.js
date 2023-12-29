// This is an external Module which helps to validate Schema Fields
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error('string.escapeHTML', { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

/**
 * Campground validation schema using Joi.
 * Defines the required fields and types for a campground object.
 * Exported for use in route validation.
 */
module.exports.campgroundValidate = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    images: [
      {
        url: Joi.string().escapeHTML(),
        filename: Joi.string().escapeHTML(),
      },
    ],
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

/**
 * Review validation schema using Joi.
 * Defines the required fields and types for a review object.
 * Exported for use in route validation.
 */
module.exports.reviewValidate = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});

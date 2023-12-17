// This is an external Module which helps to validate Schema Fields
const Joi = require('joi');

/**
 * Campground validation schema using Joi.
 * Defines the required fields and types for a campground object.
 * Exported for use in route validation.
 */
module.exports.campgroundValidate = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    images: [
      {
        url: Joi.string(),
        filename: Joi.string(),
      },
    ],
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

/**
 * Review validation schema using Joi.
 * Defines the required fields and types for a review object.
 * Exported for use in route validation.
 */
module.exports.reviewValidate = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required(),
  }).required(),
});

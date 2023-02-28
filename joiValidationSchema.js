// This is an external Module which helps to validate Schema Fields
const Joi = require('joi');

// Here we use this module to validate the fields from/in our Original Mogoose Schema
module.exports.campgroundValidate = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

import Joi from '@hapi/joi';

export default Joi.object({
    ASIN: Joi.string().required().messages({
        'any.required': 'ASIN is required',
        'string.base': 'ASIN must be a string!',
        'string.empty': 'ASIN cannot be empty!'
    }),
    SKU: Joi.string().required().messages({
        'any.required': 'SKU is required',
        'string.base': 'SKU must be a string!',
        'string.empty': 'SKU cannot be empty!'
    }),
    name: Joi.object({
        en: Joi.string().required().messages({
            'any.required': 'en name is required',
            'string.base': 'en name must be a string!',
            'string.empty': 'en name cannot be empty!'
        }),
        ar: Joi.string().required().messages({
            'any.required': 'ar name is required',
            'string.base': 'ar name must be a string!',
            'string.empty': 'ar name cannot be empty!'
        })
    }).required().messages({
        'any.required': 'name object is required',
        'object.base': 'name must be an object',
        'object.empty': 'name cannot be empty!'
    }),
    slug: Joi.object({
        en: Joi.string().required().messages({
            'any.required': 'en slug is required',
            'string.base': 'en slug must be a string!',
            'string.empty': 'en slug cannot be empty!'
        }),
        ar: Joi.string().required().messages({
            'any.required': 'ar slug is required',
            'string.base': 'ar slug must be a string!',
            'string.empty': 'ar slug cannot be empty!'
        })
    }).required().messages({
        'any.required': 'slug object is required',
        'object.base': 'slug must be an object',
        'object.empty': 'slug must be an object'
    }),
}).options({ allowUnknown: true });
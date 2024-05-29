import Joi from '@hapi/joi';

export default Joi.object({
    slug: Joi.string().required().messages({
        'any.required': 'slug is required',
        'string.base': 'slug must be a string!',
        'string.empty': 'slug cannot be empty!'
    })
})
import Joi from "@hapi/joi";

export default Joi.object({
  ASIN: Joi.string().required().messages({
    "any.required": "ASIN name is required",
    "string.base": "ASIN name must be a string!",
    "string.empty": "ASIN name cannot be empty!",
  }),
});

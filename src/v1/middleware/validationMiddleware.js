const { errorResponse } = require("../utils/responses");
const { missingFields } = require("../utils/customMessage");
const { validateRequiredFields } = require("../utils/helpers");
const { unprocessableEntity } = require("../utils/statusCode");

export default validationMiddleware = (fields) => (req, res, next) => {
  if (
    !validateRequiredFields(
      fields.map((field) => req.body[field] || req.params[field])
    )
  ) {
    return errorResponse(res, unprocessableEntity, missingFields);
  }
  next();
};

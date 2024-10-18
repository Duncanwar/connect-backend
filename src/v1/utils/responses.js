/**
 * @description it converts the success response into json object
 * @param {object} res response
 * @param {number} code status code
 * @param {string} token
 * @param {string} message
 * @param {string} data
 * @returns {object} returns json object of successfully http verb action
 */

const successResponse = (res, code, token, message, data = null) =>
  res.status(code).json({
    token,
    message,
    data,
  });

/**
 * @description returns data response
 * @param {object} res response
 * @param {number} code status code
 * @param {string} error error message
 * @returns {object} returns json object
 */
const errorResponse = (res, code, error) => {
  res.status(code).json({
    error,
  });
};

/**
 * @description returns update response
 * @param {object} res response
 * @param {number} code status code
 * @param {string} message update message
 * @returns {object} returns json object
 */
const updateResponse = (res, code, message) => {
  res.status(code).json({
    message,
  });
};

/**
 * @description returns update response
 * @param {object} res response
 * @param {number} code status code
 * @param {string} data update data
 * @returns {object} returns json object
 */
const retrieveResponse = (res, code, data = null) => {
  res.status(code).json({
    data,
  });
};

export { successResponse, errorResponse, updateResponse, retrieveResponse };

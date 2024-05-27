// errorHandler.js

import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";

    // If the error is an instance of ApiError, use its status code and message
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        errors: err.errors || [],
    });
};

export default errorHandler;

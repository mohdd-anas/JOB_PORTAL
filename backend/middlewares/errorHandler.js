// Custom API Error class to hold status code and message
export class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;
        
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

// Centralized Express Error Handling Middleware
export const errorHandler = (err, req, res, next) => {
    let { statusCode, message, errors } = err;

    // Default to 500 Internal Server Error if not an instance of ApiError
    if (!(err instanceof ApiError)) {
        statusCode = err.statusCode || 500;
        message = err.message || "Internal Server Error";
        errors = err.errors || [];
    }

    // Custom Mongoose validation/cast error handling
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(", ");
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid value for path: ${err.path}`;
    } else if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value entered";
    }

    console.error(`[Error] ${req.method} ${req.url} - Status: ${statusCode} - Message: ${message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

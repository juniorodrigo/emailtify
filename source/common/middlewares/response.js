// responseMiddleware.js

module.exports = (req, res, next) => {
    res.success = (message = 'Success', data) => {
        console.log(`Success in ${req.method} ---- URL: ${req.url} ---- Data: ${JSON.stringify(data)}`);
        res.status(200).json({
            status: 'success',
            message: message,
            data: data
        });
    };

    res.error = (error, statusCode = 500) => {
        console.log(`Error in ${req.method} ---- URL: ${req.url} ---- Error: ${error}`);
        res.status(statusCode).json({
            status: 'error',
            error: error.message || error
        });
    };


    next();
};
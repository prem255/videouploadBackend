const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config')
const { sendResponse } = require("../helper/commonfunction")

module.exports = async (req, res, next) => {
    // req.url = req.originalUrl
    const jwtToken = req.headers["authorization"]

    // console.log(req)

    const nonSecurePaths = [
        "/",
        "/api/auth/login",
        "/api/auth/forgetpassword"
    ]

    if (!nonSecurePaths.includes(req.path)) {
        if (!jwtToken) {
            return sendResponse(res, 401, 'Token missing');
        }

        try {
            const decoded = jwt.verify(jwtToken, jwtSecret);
            if (!decoded) {
                return sendResponse(res, 403, "Invalid Token.");
            }
            req.user = decoded;
            console.log("val",decoded)
            next();
        } catch (err) {
            console.error("Error in middleware", err);
            return sendResponse(res, 401, "Internal Server Error");
        }
    } else {
        // For non-secure paths, simply proceed to the next middleware or route handler.
        next();
    }

}

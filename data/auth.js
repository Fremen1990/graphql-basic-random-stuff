const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

function isPasswordCorrect(password, hash) {
    return bcrypt.compareSync(password, hash);
}
const JWT_SECRET =
    "SECRET KEY THAT SHOULD ACTUALLY BE STORED OUTSIDE THIS FILE AND NEVER COMMITTED";
function generateAuthorizationToken(user) {
    const payload = {
        sub: user.id
    };
    const secret = JWT_SECRET;
    const options = { expiresIn: "15m" };
    return jwt.sign(payload, secret, options);
}

function getUserIdFromToken(token) {
    const secret = JWT_SECRET;
    const payload = jwt.verify(token, secret);
    return payload.sub;
}

function authenticateRequest(req, db) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }
    if (!authHeader.startsWith("Bearer ")) {
        console.info("Invalid header");
        return null;
    }
    const token = authHeader.substring(7, authHeader.length);
    try {
        const userId = getUserIdFromToken(token);
        db.findResourceByIdAndType(userId, "User");
        return userId;
    } catch (error) {
        console.info(error);
        return null;
    }
}

module.exports = {
    hashPassword,
    isPasswordCorrect,
    generateAuthorizationToken,
    getUserIdFromToken,
    authenticateRequest
};

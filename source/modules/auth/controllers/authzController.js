const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); // Asegúrate de que la ruta sea correcta

const authenticate = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.error('Missing required fields', 400);
        }

        const user = await User.findOne({ email }).select('-_id UID email lastName firstName workspaces hash');
        if (!user) {
            return res.error('Incorrect email or password', 401);
        }

        const match = await bcrypt.compare(password, user.hash);
        if (!match) {
            return res.error('Incorrect email or password', 401);
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Here you can store the refreshToken in a database or a cache for further validation

        return res.success('Authenticated successfully', { accessToken, refreshToken, userData: user });
    } catch (error) {
        console.error(error);
        return res.error(error.message, 500);
    }
};

const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.error('Token not provided', 401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.error('Token is not valid', 403);
        req.user = user;
        next();
    });
};

const refreshAccessToken = async (req, res) => {
    const { token } = req.body;

    if (!token) return res.error('Refresh token not provided', 401);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.error('Refresh token is not valid', 403);

        const newAccessToken = generateAccessToken(user);
        return res.success('Access token refreshed', { accessToken: newAccessToken });
    });
};

// Funciones puras
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = {
    authenticate,
    validateToken,
    refreshAccessToken,
};

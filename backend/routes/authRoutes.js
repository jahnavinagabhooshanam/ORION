const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc Auth user & get token
// @route POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
        res.json({
            access_token: jwt.sign(
                { id: user._id, role: user.role, email: user.email },
                process.env.JWT_SECRET || 'hackathon-super-secret-key',
                { expiresIn: '30d' }
            ),
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } else {
        res.status(401).json({ msg: 'Invalid email or password' });
    }
});

// @desc Get user profile
// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    res.json({
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
    });
});

module.exports = router;

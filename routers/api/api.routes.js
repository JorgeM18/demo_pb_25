const express = require('express');
const authRoutes = require('./auth/auth.routes');

const router = express.Router();

// Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Routes
router.use('/auth', authRoutes);

module.exports = router;
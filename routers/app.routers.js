const express = require('express');
const restApiRoutes = require('./restApis/api.routes');

const router = express.Router();

//Routes
router.use('/api', restApiRoutes);

module.exports = router;
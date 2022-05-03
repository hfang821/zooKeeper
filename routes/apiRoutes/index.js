//THE "middleware"
//using this file as a central hub for all routing functions we want to add to the application
const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(animalRoutes);
router.use(require('./zookeeperRoutes'));

module.exports = router;
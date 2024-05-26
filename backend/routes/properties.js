const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

// Define routes for property operations
router.post('/', propertyController.addProperty);
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router;

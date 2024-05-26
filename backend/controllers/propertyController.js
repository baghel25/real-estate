const Property = require('../models/Property');

// Add a new property
exports.addProperty = async (req, res) => {
  try {
    const { title, description, price, bedrooms, bathrooms, location, seller } = req.body;

    // Create new property
    const property = new Property({
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      location,
      seller
    });

    // Save property to database
    await property.save();

    res.status(201).json({ message: 'Property added successfully' });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error getting properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error('Error getting property by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update property by ID
exports.updateProperty = async (req, res) => {
  try {
    await Property.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: 'Property updated successfully' });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete property by ID
exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

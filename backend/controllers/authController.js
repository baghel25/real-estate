// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Register a new user
// exports.register = async (req, res) => {
//   try {
//     const { firstName, lastName, email, phoneNumber, password, userType } = req.body;

//     // Check if user already exists
//     let user = await User.findOne({ email });
//       if (user) {
//         console.log('Registration request received:', req.body);
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     user = new User({
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       password: hashedPassword,
//       userType
//     });

//     // Save user to database
//       await user.save();
//       console.log('User registered successfully');
  
//     //   res.status(201).json({ message: 'User registered successfully' });

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
// // Login user
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Check password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
//     console.error('loggen succefully',);

//     res.status(200).json({ token });
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// ------------------------------
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

exports.register = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, userType } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      userType
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loadUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


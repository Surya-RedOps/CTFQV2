const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await User.findOne({ email: 'admin@ctfquest.com' });
    if (adminExists) {
      return res.status(200).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    const admin = new User({
      username: 'admin',
      email: 'admin@ctfquest.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    
    res.status(200).json({ 
      message: 'Admin created successfully',
      credentials: {
        email: 'admin@ctfquest.com',
        password: 'Admin123!'
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  } finally {
    mongoose.disconnect();
  }
};
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await User.findOne({ email: 'admin@pwnGrid.com' });
    if (adminExists) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    const admin = new User({
      username: 'admin',
      email: 'admin@pwnGrid.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    console.log('Admin created successfully');
    console.log('Email: admin@pwnGrid.com');
    console.log('Password: Admin123!');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();
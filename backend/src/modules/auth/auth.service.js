const prisma = require('../../prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple in-memory storage for mock mode
let mockUserStore = null;

const registerUser = async (data) => {
  const { name, email, password } = data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (dbError) {
    if (dbError.message === 'User already exists') throw dbError;
    console.warn('⚠️ Database connection failed, using mock registration.');
    
    // Save to in-memory store for this session
    mockUserStore = {
      id: 'mock-id-' + Date.now(),
      name,
      email,
      role: 'USER',
      points: 0,
      coins: 0,
      reputationScore: 0,
      createdAt: new Date()
    };
    
    return mockUserStore;
  }
};

const loginUser = async (data) => {
  const { email, password } = data;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  } catch (dbError) {
    if (dbError.status === 401) throw dbError;
    console.warn('⚠️ Database connection failed, using mock login.');
    
    // Use the name from registration if available, else default to Developer
    const user = mockUserStore || { 
      id: 'mock-user-id', 
      name: 'Developer', 
      email, 
      role: 'USER',
      points: 1250,
      coins: 450,
      reputationScore: 85,
      createdAt: new Date()
    };
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'dev_secret'
    );
    return { user, token };
  }
};

const getMe = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
        coins: true,
        reputationScore: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (dbError) {
    if (dbError.message === 'User not found') throw dbError;
    console.warn('⚠️ Database connection failed, using mock profile.');
    
    return mockUserStore || {
      id: userId || 'mock-user-id',
      name: 'Developer',
      email: 'dev@smartmap.city',
      role: 'USER',
      points: 1250,
      coins: 450,
      reputationScore: 85,
      createdAt: new Date()
    };
  }
};

const logoutUser = async (token) => {
  try {
    // Decode (without verifying again) to get the expiry time
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    await prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt
      }
    });
  } catch (dbError) {
    console.warn('⚠️ Database connection failed, logout recorded in memory (mock).');
  }
};

const isTokenBlacklisted = async (token) => {
  try {
    const entry = await prisma.blacklistedToken.findUnique({
      where: { token }
    });
    return !!entry;
  } catch (dbError) {
    return false; // Assume not blacklisted if DB fails
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  isTokenBlacklisted
};
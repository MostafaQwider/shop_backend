const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersService = require('../services/usersService');
const sendResponse = require('../helpers/responseHelper');

const secret = process.env.JWT_SECRET || 'secret';
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return sendResponse(res, false, "Name, email and password required", null, 400);
    }

    const existing = await usersService.findByEmail(email);
    if (existing) {
      return sendResponse(res, false, "Email already in use", null, 400);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await usersService.create({
      name,
      email,
      password: hashed,
      address
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn }
    );

    sendResponse(res, true, "User registered successfully", {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address || ''
      },
      token
    }, 201);

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersService.findByEmail(email);

    if (!user) {
      return sendResponse(res, false, "Invalid credentials", null, 400);
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return sendResponse(res, false, "Invalid credentials", null, 400);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn }
    );

    sendResponse(res, true, "Login successful", {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });

  } catch (err) {
    console.error(err);
    sendResponse(res, false, "Server error", null, 500);
  }
};

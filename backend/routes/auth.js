import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, userType } = req.body;

    // Provjera postojećeg usera
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email već postoji' });
    }

    // Generiranje PIN-a
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Kreiranje usera
    const user = await User.create({
      name,
      email,
      password,
      userType,
      verificationCode
    });

    // Slanje email-a s PIN-om
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${verificationCode}`
    });

    res.status(201).json({
      message: 'Registration successful',
      email: user.email
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Email not verified',
        requiresVerification: true,
        email: user.email
      });
    }

    if (user.userType === 'business' && !user.isApproved) {
      return res.status(403).json({
        message: 'Account pending approval',
        isPending: true
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        isApproved: user.isApproved
      },
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify PIN
router.post('/verify-pin', async (req, res) => {
  try {
    const { email, pin } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verificationCode !== pin) {
      return res.status(400).json({ message: 'Invalid PIN' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        isApproved: user.isApproved
      },
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
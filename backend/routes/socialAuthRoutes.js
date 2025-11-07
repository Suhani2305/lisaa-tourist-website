const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Google OAuth Login
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    // Verify Google token
    const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const googleUser = googleResponse.data;

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: googleUser.email },
        { providerId: googleUser.sub, provider: 'google' }
      ]
    });

    if (user) {
      // Update provider info if needed
      if (user.provider !== 'google') {
        user.provider = 'google';
        user.providerId = googleUser.sub;
        if (googleUser.picture) {
          user.profileImage = googleUser.picture;
        }
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name: googleUser.name || googleUser.email.split('@')[0],
        email: googleUser.email,
        provider: 'google',
        providerId: googleUser.sub,
        profileImage: googleUser.picture || '',
        password: Math.random().toString(36).slice(-12) // Random password for social login users
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google login successful',
      user: user.toJSON(),
      token: jwtToken
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
});

// Facebook OAuth Login
router.post('/facebook', async (req, res) => {
  try {
    const { accessToken, userID } = req.body;

    if (!accessToken || !userID) {
      return res.status(400).json({ message: 'Facebook access token and user ID are required' });
    }

    // Verify Facebook token and get user info
    const facebookResponse = await axios.get(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    const facebookUser = facebookResponse.data;

    if (!facebookUser || !facebookUser.email) {
      return res.status(400).json({ message: 'Invalid Facebook token or email not provided' });
    }

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: facebookUser.email },
        { providerId: facebookUser.id, provider: 'facebook' }
      ]
    });

    if (user) {
      // Update provider info if needed
      if (user.provider !== 'facebook') {
        user.provider = 'facebook';
        user.providerId = facebookUser.id;
        if (facebookUser.picture?.data?.url) {
          user.profileImage = facebookUser.picture.data.url;
        }
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name: facebookUser.name || facebookUser.email.split('@')[0],
        email: facebookUser.email,
        provider: 'facebook',
        providerId: facebookUser.id,
        profileImage: facebookUser.picture?.data?.url || '',
        password: Math.random().toString(36).slice(-12) // Random password for social login users
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Facebook login successful',
      user: user.toJSON(),
      token: jwtToken
    });
  } catch (error) {
    console.error('Facebook login error:', error);
    res.status(500).json({ message: 'Facebook login failed', error: error.message });
  }
});

module.exports = router;


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const SUPER_ADMIN_EMAIL = 'kartik'; // Will be matched by name since we don't have email

const configurePassport = () => {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Check if user exists by email
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.avatar = profile.photos[0]?.value || '';
          await user.save();
        } else {
          // Determine role based on name/email
          let role = 'member';
          const name = profile.displayName.toLowerCase();
          const email = profile.emails[0].value.toLowerCase();
          
          if (name.includes('kartik') || email.includes('kartik')) {
            role = 'super_admin';
          }
          
          // Create new user
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos[0]?.value || '',
            role: role,
            lastLogin: new Date()
          });
        }
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
  } else {
    console.log('ℹ️ Google OAuth credentials not provided. Google Login disabled (Email/Password login is active).');
  }

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

module.exports = configurePassport;

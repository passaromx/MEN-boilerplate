const mongoose = require('mongoose');
const passport = require('passport');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

// Load Input Validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateResetInput = require('../validation/reset');

module.exports = {
  register: (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
  
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });
  
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
          role: req.body.role
        });
  
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  },

  login: (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
  
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    const email = req.body.email;
    const password = req.body.password;
  
    // Find user by email
    User.findOne({ email }).then(user => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }
  
      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload
  
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            }
          );
        } else {
          errors.password = 'Password incorrect';
          return res.status(400).json(errors);
        }
      });
    });
  },

  createReset: (req, res, next) => {
    const { errors, isValid } = validateResetInput.create(req.body);
  
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const { email } = req.body;
    User.findOne({ email })
      .then(user => {

        if (!user) {
          errors.email = 'User not found';
          return res.status(404).json(errors);
        }

        const payload = {
          email: user.email,
          name: user.name,
          id: user.id
        }

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: token
            });
          }
        );
      });
  },

  resetPassword: (req, res, next) => {
    const { errors, isValid } = validateResetInput.reset(req.body);
  
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { token } = req.params;

    const decode = jwt.verify(token, keys.secretOrKey);

    User.findOne({ email: decode.email })
      .then(user => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      })
  }

};
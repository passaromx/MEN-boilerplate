const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/User');

module.exports = {
  health: (req, res) => res.json({ msg: 'Users Works!' }),

  me: (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }

};

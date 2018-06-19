const passport = require('passport');

const User = require('../models/User');

const vars = require('../config/vars');

// handleJWT with roles
const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info
  // log user in
  try {
    if (error || !user) throw error
    await req.logIn(user, { session: false })
  } catch (e) {
    return res.status(401).json(e.message);
  }
  // see if user is authorized to do the action
  if (!roles.includes(user.role)) {
    return res.status(401).json('Invalid role');
  }
  
  req.user = user

  return next()
}

// exports the middleware
const requireAuth = (roles = vars.roles) => (req, res, next) =>
  passport.authenticate(
    'jwt',
    { session: false },
    handleJWT(req, res, next, roles)
  )(req, res, next)

module.exports = requireAuth;
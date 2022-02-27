const { STATUS } = require('../constants/api.constants');
const UsersDao = require('../models/daos/Users.dao');
const { formatErrorObject } = require('../utils/api.utils');
const { formatUserForDB } = require('../utils/users.utils');

const User = new UsersDao();

const register = async (req, res, next) => {
  const newUser = formatUserForDB(req.body);
  try {
    const registeredUser = await User.createUser(newUser);
    req.session.user = registeredUser;
    return res.redirect('/profile');
  }
  catch(error) {
    console.log(error.message);
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.getByEmail(email);
    if (user.password !== password) {
      const newError = formatErrorObject(STATUS.BAD_REQUEST, 'Wrong username of password');
      return next(JSON.stringify(newError));
    }
    req.session.user = user;
    return res.redirect('/profile');
  }
  catch(error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
}
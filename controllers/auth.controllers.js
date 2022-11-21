const { HTTP_STATUS } = require('../constants/api.constants');
const UsersDao = require('../models/daos/Users.dao');
const { HttpError } = require('../utils/api.utils');
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
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.getByEmail(email);
    if (user.password !== password) {
      return next(new HttpError(HTTP_STATUS.BAD_REQUEST, 'Wrong username of password'));
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
const { STATUS } = require('../constants/api.constants');
const UsersDao = require('../models/daos/Users.dao');
const { apiSuccessResponse } = require('../utils/api.utils');
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
  try {
    const user = req.session.user;
    const accounts = await User.getUserAccounts(user);
    return res.json(apiSuccessResponse(STATUS.OK, accounts));
  }
  catch {

  }
};

const logout = async (req, res, next) => {
  try {

  }
  catch {

  }
};

module.exports = {
  login,
  register,
  logout,
}
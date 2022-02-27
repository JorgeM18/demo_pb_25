const UsersDao = require('../models/daos/Users.dao');
const AccountsDao = require('../models/daos/Accounts.dao');
const { formatUserForDB } = require('../utils/users.utils');
const { generateInitialAccount } = require('../utils/accounts.utils');
const { apiSuccessResponse } = require('../utils/api.utils');
const { STATUS } = require('../constants/api.constants');

const User = new UsersDao();
const Account = new AccountsDao();

const createAccount = async (userId) => {
  const accountItem = generateInitialAccount();
  accountItem.owner = userId;
  return await Account.createItem(accountItem);
};

const login = async (req, res, next) => {
  try {

  }
  catch {

  }
};

const register = async (req, res, next) => {
  const newUser = formatUserForDB(req.body);
  try {
    const registeredUser = await User.createItem(newUser, createAccount);
    return res
      .status(STATUS.CREATED.code)
      .json(apiSuccessResponse(STATUS.CREATED, registeredUser));
  }
  catch(error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
}
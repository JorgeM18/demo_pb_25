const MongoDBContainer = require('../containers/Mongodb.container');
const AccountsDao = require('../daos/Accounts.dao');
const { generateInitialAccount } = require('../../utils/accounts.utils');
const { formatErrorObject } = require('../../utils/api.utils');
const UserSchema = require('../schemas/User.schema');
const constants = require('../../constants/api.constants');

const { 
  STATUS: { 
    INTERNAL_ERROR,
    NOT_FOUND,
    BAD_REQUEST,
  }
} = constants;

const collection = 'User';
const Account = new AccountsDao();

class UsersDao extends MongoDBContainer {
  static instance;
  constructor() {
    if (!UsersDao.instance) {
      super(collection, UserSchema);
      UsersDao.instance = this;
      return this;
    }
    else {
      return UsersDao.instance;
    }
  }

  async createUser(userItem) {
    const user = await this.createItem(userItem);
    const accountItem = generateInitialAccount();
    accountItem.owner = user._id; 
    const account = await Account.createItem(accountItem);
    user.accounts = [account._id];
    await user.save();
    return user;
  };

  async getById(id) {
    try {
      const document = await this.model
        .findById(id, { __v: 0 })
        .populate('accounts').lean();
      if (!document) {
        const errorMessage = `Resource with id ${id} does not exist in our records`;
        const newError = formatErrorObject(NOT_FOUND.tag, errorMessage);
        throw new Error(JSON.stringify(newError));
      } else {
        return document;
      }
    }
    catch(error) {
      const newError = formatErrorObject(INTERNAL_ERROR.tag, error.message);
      throw new Error(JSON.stringify(newError));
    }
  }
};

module.exports = UsersDao;
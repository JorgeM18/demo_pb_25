const MongoDBContainer = require('../containers/Mongodb.container');
const UserSchema = require('../schemas/User.schema');

const collection = 'User';

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
};

module.exports = UsersDao;
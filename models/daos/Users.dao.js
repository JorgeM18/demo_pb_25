const MongoDBContainer = require('../containers/Mongodb.container');
const UserSchema = require('../schemas/User.schema');

const collection = 'User';

class UsersDao extends MongoDBContainer {
  constructor() {
    super(collection, UserSchema);
  }
};

module.exports = UsersDao;
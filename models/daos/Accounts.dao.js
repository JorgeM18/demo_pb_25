const MongoDBContainer = require('../containers/Mongodb.container');
const AccountSchema = require('../schemas/Account.schema');

const collection = 'Account';

class AccountsDao extends MongoDBContainer {
  constructor() {
    super(collection, AccountSchema);
  }
};

module.exports = AccountsDao;
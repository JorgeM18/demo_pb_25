const env = require('../env.config');

module.exports = {
  mongodb: {
    connectTo: (database) => `mongodb+srv://jorelmaro:${env.DB_PASSWORD}@coder.3c0d1.mongodb.net/${database}?retryWrites=true&w=majority`,
  }
}
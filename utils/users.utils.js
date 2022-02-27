const moment = require('moment');

const formatForDB = (userObj) => {
  const today = moment();
  const userAge = moment(userObj.birthdate).diff(today, 'years');
  const newUser = {
    firstname: userObj.firstname,
    lastname: userObj.lastname,
    birthdate: userObj.birthdate,
    age: userAge,
    email: userObj.email,
    password: userObj.password,
  };
  return newUser;
};

module.exports = {
  formatForDB,
  
}
const bcrypt = require('bcrypt');
module.exports = {
  checkLogin: function (email, passwd, users) {
    var login = "failed";
    for (var userid in users) {
      if (email === users[userid].email && bcrypt.compareSync(passwd, users[userid].password)) {
        login = "login worked!";
        console.log(login);
        return login;
      }
    }
    return login;
  },
  checkUserIdExists: function (userid, users) {
    if (userid) {
      for (var ids in users) {
        if (userid === ids) {
          return true;
        }
      }
    }
    return false;
  },
  checkUserExists: function (usernm, email, users) {
    var login = "login or email is unique";
    for (var userid in users) {
      if (usernm === users[userid].username || email === users[userid].email) {
        login = "return error, email or username exists already";
      }
    }
    console.log(login);
    return login;
  },
  checkShortURLExists: function (urlId, urlDatabase) {
    /*Accepts [urlId, urlDatabase] and checks if it 
    exists in your database*/

    for (var shortUrl in urlDatabase) {
      if (urlId === shortUrl) {
        return true;
      }
    }
    return false;
  },
  confirmOwnership: function (shortURL, user_id, urlDatabase) {
    /* Accepts [short url, userid, urlDatabase] and 
    confirms this user id matches with the short url.
    */
    for (var urlKeys in urlDatabase) {
      if (shortURL === urlKeys) {
        if (user_id === urlDatabase[urlKeys].userid) {
          return true;
        }
      }
    }
    return false;
  },


  findUserId: function (email, users) {
    for (var userId in users) {
      if (email === users[userId].email) {
        return userId;
      }
    }
    return false;
  }
};
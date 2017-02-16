const bcrypt = require('bcrypt');
module.exports = {
  checkLogin: function (email, passwd, users) {
    debugger;
    let login = "failed";
    for (var userid in users) {
      debugger;
      if (email === users[userid].email && bcrypt.compareSync(passwd, users[userid].password)) {
        debugger;
        login = "login worked!";
        return login;
      }
    }
    return login;
  },

  checkUserExists: function (usernm, email, users) {
    let login = "login or email is unique";
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

    for (let urlKeys in urlDatabase) {
      if (shortURL === urlKeys) {
        if (user_id === urlDatabase[urlKeys].userid) {
          return true;
        }
      }
    }
    return false;
  },


  findUserId: function (email, users) {
    debugger;
    for (var userId in users) {
      if (email === users[userId].email) {
        return userId;
      }
    }
    return false;
  },

  emailFromUserCookie: function (cookie, users) {
    var output = ""
    for (var userid in users) {
      console.log(users[userid]);
      console.log(cookie);
      if (cookie === users[userid].username) {
        output = users[userid].email;
      } else {
        output = "cant find email in ase";
      }
    }
    return output;
  }
};
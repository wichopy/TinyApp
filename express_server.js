var express = require("express");
const userFuncs = require("./userFunctions.js");
var app = express();
var PORT = process.env.PORT || 8080; //adapts to ports of the application.
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const generateRandomString = require('./generateRandom.js');
var morgan = require("morgan");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
app.use(cookieSession({
  keys: ['user_id'],
  maxAge: 15 * 60 * 1000 //expires after 15 minutes
}));
app.use(bodyParser.urlencoded({ entended: true })); //x-www-form-urlencoded things can be submitted in different formats, could be in the url, body-parser will json it for us.
app.use(bodyParser.json()); // parse submission in multiple formats.
app.use(morgan('dev'));
app.use(express.static('public'));
//app.use(cookieParser());
app.set("view engine", "ejs");

const users = {
  '666aaa': {
    id: '666aaa',
    username: 'admin',
    email: "admin@tiny.ca",
    password: bcrypt.hashSync("password", 10)

  },
  '42O77P': {
    id: '42O77P',
    username: 'test',
    email: "test@test.ca",
    password: bcrypt.hashSync("testtest", 10)

  }
};

var urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userid: '666aaa'
  },
  "9sm5xK": {
    url: "http://www.google.com",
    userid: '42O77P'
  },
  userURLs: function (userid) {
    var urlData = {};
    for (var url in this) {
      debugger;
      if (this[url].userid == userid) {
        urlData[url] = this[url].url;
      }
    }
    return urlData;
  }
};

//ROUTES!
//this can modify the 

// app.use((req, res, next) => {
//   req.random = 42;
//   next(); //error, go somewhere else, data,
// });

//--------------------
//HOMEPAGE
//-------------------
app.get("/", (req, res) => {
  debugger;
  if (!req.session.user_id) { ///UNDEFINED IS FALSEY!!
    res.render("home", { username: false, email: false }); //pass in false username and email info to force login or register in header.
    debugger;
  } else {
    res.render("home", users[req.session.user_id]);
  }
});


//--------------------
//login/register/logout
//-------------------
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/"); //If you don't send a response your cookie wont be cleared.
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get('/register', (req, res) => {
  res.render("register", users);
});

app.post("/login", (req, res) => {
  if (userFuncs.checkLogin(req.body.email, req.body.password, users) == 'failed') {
    res.status(400).send("Wrong username and password!");
  } else {
    // var userid = userFuncs.findUserId(req.body.email, users);
    req.session.user_id = userFuncs.findUserId(req.body.email, users);
    res.redirect("/");
  }
});

app.post('/register', (req, res) => {
  debugger;
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Make sure you put a password and email address! <img src='https://i.ytimg.com/vi/y7rjewGdwpI/maxresdefault.jpg' width='800' height='600' > ");
    debugger;
  } else {
    debugger;
    if (userFuncs.checkUserExists(req.body.username, req.body.email, users) === "login or email is unique") {
      debugger;
      userid = generateRandomString();
      console.log(req.body);
      users[userid] = {};
      users[userid].username = req.body.username;
      users[userid].email = req.body.email;
      users[userid].id = userid;
      const pswd = req.body.password;
      const hashed_password = bcrypt.hashSync(pswd, 10);
      users[userid].password = hashed_password;
      res.cookie('id', userid, { path: "/" });
      res.redirect("/");
      console.log("this is your users database now");
      console.log(users);
    } else {
      res.status(400).send("user or email already exists.");
    }
  }
});


app.get("/api", (req, res) => {
  res.json({
    users: users,
    urls: urlDatabase
  });
}); // chrome plugin for JSON pretify

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].url;
  res.redirect(longURL);
});

//---------------------------------------
//URLS Routes
//---------------------------------------
app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    var templateVars = {
      urls: urlDatabase.userURLs(req.session.user_id),
      username: users[req.session.user_id].username,
      email: users[req.session.user_id].email
    };
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    res.render("urls_new", users[req.session.user_id]);
  }
});


app.get("/urls/:id", (req, res) => {
  debugger;
  if (!req.session.user_id) {
    debugger;
    res.redirect("/login");
  } else {
    let templateVars = {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id],
      username: users[req.session.user_id].username,
      email: users[req.session.user_id].email,
      id: users[req.session.user_id].id
    };
    debugger;
    res.render("urls_show", templateVars);
  }
});
app.post("/urls/:id/update", (req, res) => {
  var longURL = req.body.longURL;
  urlDatabase[req.params.id] = {
    url: longURL,
    userid: req.session.user_id
  };
  res.redirect("/urls/?alert=success&action=update");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls/?alert=success&action=delete");
});

app.post("/urls", (req, res) => {
  let newString = generateRandomString();
  urlDatabase[newString] = {
    url: req.body.longURL,
    userid: req.session.user_id
  };
  res.redirect("/urls/?alert=success&action=addnew"); // Respond with 301 or 304 to browser.
});

//---------------------------------------
//Listening
//---------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
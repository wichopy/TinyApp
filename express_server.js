var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; //adapts to ports of the application.
const cookieParser = require('cookie-parser');

//app.set('port',PORT); 
//const routes = require("./routes.js");

//app(routes); // require routes.js and use that for our routes.
//app.get(PORT) //how faisal did it
//
var morgan = require("morgan");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ entended: true })); //x-www-form-urlencoded things can be submitted in different formats, could be in the url, body-parser will json it for us.
app.use(bodyParser.json()); // parse submission in multiple formats.
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(cookieParser());
app.set("view engine", "ejs");
//app.use(express.urlencoded());

function generateRandomString() {
  var randnum = function () { return Math.floor(Math.random() * 10); }; //random numbers
  var randLLet = function () { return Math.floor(Math.random() * (90 - 65 + 1) + 65); }; // random ascii letter upper case
  var randULet = function () { return Math.floor(Math.random() * (122 - 97 + 1) + 97); }; //random ascii letter lowercase
  var randArray = [randnum, randLLet, randULet]; ///Generate numbers 0-2 to select a random character.
  var randNum = function () { return Math.floor(Math.random() * 3); };
  var randString = "";
  for (var i = 0; i < 6; i++) {
    //console.log("pick a random function");
    //console.log(randNum())
    var char = randArray[randNum()];
    //console.log(char);
    // console.log("run this random function to create a random number or letter");
    char = char();
    // console.log(char);
    if (char >= 0 && char <= 9) {
      // console.log("add number to randomString")
      randString += String(char);
    }
    if (char >= 65 && char <= 90) {
      // console.log("add upper case letter to random String")
      randString += String.fromCharCode(char);
    }
    if (char >= 97 && char <= 122) {
      // console.log("add lower case letter to random String")
      randString += String.fromCharCode(char);
    }
  }
  return randString;
}




const users = {
  '666aaa': {
    username: 'admin',
    email: "admin@tiny.ca",
    password: "password"

  },
  '42O77P': {
    username: 'test',
    email: "test@test.ca",
    password: "testtest"

  }
};




var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function checkLogin(usernm, passwd) {
  let login = "failed";
  for (var userid in users) {
    // console.log("checking for login credentials");
    // console.log("username is:");
    // console.log(users[userid]);
    // console.log(usernm);
    // console.log(passwd);

    if (usernm === users[userid].username && passwd === users[userid].password) {
      login = "login worked!";
      return login;
    }
  }
  console.log(login);
  return login;
}

function checkUserExists(usernm, email) {
  let login = "login or email is unique";
  for (var userid in users) {
    // console.log("checking for login credentials");
    // console.log("username is:");
    // console.log(users[userid]);
    // console.log(usernm);
    // console.log(passwd);

    if (usernm === users[userid].username || email === users[userid].email) {
      login = "return error, email or username exists already";
    }
  }
  console.log(login);
  return login;
}

function findUserId(username) {
  debugger;
  for (var userId in users) {
    if (username === users[userId].username) {
      return userId;
    }
  }
  return false;
}

function emailFromUserCookie(cookie) {
  var output = ""
  for (var userid in users) {
    console.log(users[userid]);
    console.log(cookie);
    if (cookie === users[userid].username) {
      output = users[userid].email;
    } else {
      output = "cant find email in database";
    }
  }
  return output;
}
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
  // let templateVars = {
  //   id: req.cookies.id,
  //   email: emailFromUserCookie(req.cookies.name)
  // };
  //console.log(req.cookies);
  //console.log(Object(req.cookies).keys);
  if (!req.cookies.id) { ///UNDEFINED IS FALSEY!!
    console.log("Empty cookie");
    console.log({ username: false, email: false });
    res.render("home", { username: false, email: false }); //pass in false username and email info to force login or register in header.
  } else {
    console.log("this is the cookie and userid");
    console.log(req.cookies);
    console.log(users[req.cookies.id]);
    res.render("home", users[req.cookies.id]);
  }
});


//--------------------
//login/register/logout
//-------------------
app.get("/logout", (req, res) => {
  console.log("Loging out, clear cookies for this session.");
  res.clearCookie('id', { path: "/" });
  console.log(req.cookies);
  res.redirect("/"); //If you don't send a response your cookie wont be cleared.
});

app.get("/login", (req, res) => {
  // let templateVars = {
  //   username: req.cookies['name'],
  //   email: emailFromUserCookie(req.cookies.name)
  // };
  res.render("login", users);
});

app.post("/login", (req, res) => {

  if (checkLogin(req.body.username, req.body.password) == 'failed') {
    res.status(400).send("Wrong username and password!");
  } else {
    //function to check username and password.
    //console.log(req.cookie);
    console.log(req.body);
    var userid = findUserId(req.body.username);
    res.cookie('id', userid, { path: "/" });
    //console.log(res.cookies());
    res.redirect("/");
  }
});

app.get('/register', (req, res) => {
  console.log("lets make a new user!");
  // var templateVars = {
  //   username: req.cookies['name'],
  //   email: emailFromUserCookie(req.cookies.name)
  // };
  res.render("register", users);
  //need to implement status codes for:
  //if user exists already.
  //if email or password are empty.
  //if email exists already.

});
//use res.cookie to access cookies in responses.
app.post('/register', (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Make sure you put a password and email address! <img src='https://i.ytimg.com/vi/y7rjewGdwpI/maxresdefault.jpg' width='800' height='600' > ");

  } else {
    if (checkUserExists(req.body.username, req.body.email) === "login or email is unique") {

      userid = generateRandomString();
      console.log(req.body);
      users[userid] = req.body;
      users[userid].id = userid;
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
    key: 'Value'
  });
}); // chrome plugin for JSON pretify
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  console.log("trying to redirect now ...");
  console.log(longURL);
  console.log(req.params.shortURL);
  res.redirect(longURL);
});




app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});
//---------------------------------------
//URLS Routes
//---------------------------------------
app.get("/urls", (req, res) => {
  console.log("this is the cookie and userid");
  console.log(req.cookies);
  var templateVars = {
    urls: urlDatabase,
    username: users[req.cookies.id].username,
    email: users[req.cookies.id].email,
  }; //all of them are stored in an object called locals
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // var templateVars = {
  //   username: req.cookies['name'],
  //   email: emailFromUserCookie(req.cookies.name)
  // }
  res.render("urls_new", users[req.cookies.id]);
});


app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: users[req.cookies.id].username,
    email: users[req.cookies.id].email,
    id: users[req.cookies.id].id
  };
  console.log(templateVars.email);
  res.render("urls_show", templateVars);
});
app.post("/urls/:id/update", (req, res) => { //may not need to
  var longURL = req.body.longURL;
  urlDatabase[req.params.id] = ("http://" + longURL);
  res.redirect("/urls/?alert=success&action=update");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls/?alert=success&action=delete");
});

app.post("/urls", (req, res) => {
  let newString = generateRandomString();
  urlDatabase[newString] = "http://" + req.body.longURL;
  res.redirect("/urls/?alert=success&action=addnew"); // Respond with 301 or 304 to browser.
});

//---------------------------------------
//Listing
//---------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
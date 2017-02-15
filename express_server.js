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



var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//ROUTES!
//this can modify the 

// app.use((req, res, next) => {
//   req.random = 42;
//   next(); //error, go somewhere else, data,
// });


app.get("/", (req, res) => {
  //console.log(req.body);
  //console.log(req.cookie);
  console.log("navigated to home page");
  console.log(req.cookies['name']);
  let templateVars = { username: req.cookies['name'] };
  //console.log(local);
  res.render("home", templateVars);
});

app.get("/login", (req, res) => {
  //console.log(req.body);
  //console.log(req.cookie);

  res.render("login");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  console.log(req.body.username);
  //console.log(req.cookie);
  res.cookie('name', req.body.username);
  //console.log(res.cookies());
  res.redirect("/");
});
app.get('/register', (req, res) => {
  res.render("register");
});
//use res.cookie to access cookies in responses.
app.post('/register', (req, res) => {
  console.log(req.body);
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
app.get("/urls", (req, res) => {
  var templateVars = {
    urls: urlDatabase,
    username: req.cookies['name']
  }; //all of them are stored in an object called locals
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  var templateVars = { username: req.cookies['name'] };
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies['name']
  };
  res.render("urls_show", templateVars);
});



app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls/:id/update", (req, res) => { //may not need to
  console.log(`Updating ${req.params.id} : change from`); // debug statement to see POST parameters
  console.log(urlDatabase[req.params.id]);
  console.log("to");
  var longURL = req.body.longURL;
  urlDatabase[req.params.id] = ("http://" + longURL);
  console.log(longURL);
  console.log("This is what the database looks like now:");
  console.log(urlDatabase); // NEED to put http:// in new address or else it will not redirect properly.
  //res.send("Will delete your entry for you!"); // Respond with 'Ok' (we will replace this)
  //var templateVars = { urls: urlDatabase };
  res.redirect("/urls/?alert=success&action=update");
});

app.post("/urls/:id/delete", (req, res) => {
  console.log(`Deleting ${req.params.id}`); // debug statement to see POST parameters
  delete urlDatabase[req.params.id];
  //res.send("Will delete your entry for you!"); // Respond with 'Ok' (we will replace this)
  //var templateVars = { urls: urlDatabase };
  res.redirect("/urls/?alert=success&action=delete");
});



app.post("/urls", (req, res) => {
  console.log(req.body); // debug statement to see POST parameters
  console.log("call randomString generator");
  let newString = generateRandomString();
  console.log(`add to database`);
  urlDatabase[newString] = "http://" + req.body.longURL;
  console.log(urlDatabase);
  res.redirect("/urls/?alert=success&action=addnew"); // Respond with 301 or 304 to browser.
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = app;
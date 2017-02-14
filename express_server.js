var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var morgan = require("morgan");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ entended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));
app.set("view engine", "ejs");

function generateRandomString() {
  let randnum = function () { return Math.floor(Math.random() * 10 + 1); }; //random numbers
  let randLLet = function () { return Math.floor(Math.random() * (90 - 65 + 1) + 65); }; // random ascii letter upper case
  let randULet = function () { return Math.floor(Math.random() * (122 - 97 + 1) + 97); }; //random ascii letter lowercase
  let randArray = [randnum, randLLet, randULet]; ///Generate numbers 0-2 to select a random character.
  let randNum = function () { return Math.floor(Math.random() * 2); };
  let randString = "";
  for (let i = 0; i < 6; i++) {
    randArray[randNum];
  }
}


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  var templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.end("Hello!");
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body); // debug statement to see POST parameters
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});



app.post("/urls", (req, res) => {
  console.log(req.body); // debug statement to see POST parameters
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
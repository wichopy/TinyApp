const express = require("express");
const userFuncs = require("./userFunctions.js"); //functions for querying database.
const app = express();
const PORT = process.env.PORT || 8080; //adapts to ports of the application.

const cookieSession = require('cookie-session');
app.use(cookieSession({
  keys: ['user_id'],
  maxAge: 15 * 60 * 1000 //expires after 15 minutes
}));

const generateRandomString = require('./generateRandom.js'); //random string generator.
const morgan = require("morgan");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
app.use(bodyParser.urlencoded({ entended: true })); //x-www-form-urlencoded things can be submitted in different formats, could be in the url, body-parser will json it for us.
app.use(bodyParser.json()); // parse submission in multiple formats.
app.use(methodOverride());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(morgan('dev'));
app.use(express.static('public'));
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

//database: [Date-Time / urlID / visitorID]
const visitHistory = [{
    date: "01/01/2017",
    urlId: "b2xVn2",
    visitorId: "123fgA"
  },
  {
    date: "01/02/2017",
    urlId: "b2xVn2",
    visitorId: "123fgA"
  },
  {
    date: "01/03/2017",
    urlId: "9sm5xK",
    visitorId: "fgA234"
  },
  {
    date: "01/04/2017",
    urlId: "b2xVn2",
    visitorId: "fgA234"
  },
  {
    date: "01/05/2017",
    urlId: "9sm5xK",
    visitorId: "123fgA"
  }
];


const urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userid: '666aaa'
  },
  "9sm5xK": {
    url: "http://www.google.com",
    userid: '42O77P'
  },
  userURLs: function (userid) {
    //query database for url's for the user id.
    let urlData = {};
    for (let url in this) {

      if (this[url].userid == userid) {
        urlData[url] = this[url].url;
      }
    }
    return urlData;
  },
  urlVisitHistory: function (urlId, visitdb) {
    //returns array of all visits to a urlID
    //reduce array of objects into 
    return visitdb
      .filter((datelog) => {
        return datelog.urlId === urlId;
      });
  },
  urlViewCount: (urlId, visitdb) => {
    //Returns total view count of urlID
    return visitdb
      .filter((datelog) => {
        return datelog.urlId === urlId;
      }).length;
  },
  urlUniqueVisit: (urlId, visitdb) => {
    //Returns unique count of visitors.
    //loop through object and add any visitor ID's to an object.
    //return count of keys.
    let uniqueVisits = {};
    for (var datelog in visitdb) {
      if (!uniqueVisits[datelog.visitorId]) {
        uniqueVisits[datelog.visitorId] = 1;
      }
    }
    return Object.keys(uniqueVisits).length;
  }
};
//********************* */
//ROUTES!
//************************ */

//If you want to see my data without console logging use this handy link!
app.get("/api", (req, res) => {
  res.json({
    users: users,
    urls: urlDatabase
  });
}); // chrome plugin for JSON pretify

//--------------------
//HOMEPAGE                      was not asked for in the instructions but 
//-------------------
app.get("/", (req, res) => {
  if (!userFuncs.checkUserIdExists(req.session.user_id, users)) { ///UNDEFINED IS FALSEY!! Check for unmatch user id's that could have been created in cookie during debugging and forgot to be cleared.
    res.render("home", { username: false, email: false }); //pass in false username and email info to force login or register in header.
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
  if (req.session.user_id) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

app.get('/register', (req, res) => {
  if (req.session.user_id) {
    res.redirect("/");
  } else {
    res.render("register", users);
  }
});

app.post("/login", (req, res) => {
  if (userFuncs.checkLogin(req.body.email, req.body.password, users) == 'failed') { //this is probably not the best method but no time to make it better.
    res.status(401).send("Wrong username and password!");
  } else {
    req.session.user_id = userFuncs.findUserId(req.body.email, users);
    res.redirect("/urls");
  }
});

app.post('/register', (req, res) => { // keep as post, creating a user.
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Make sure you put a password and email address! <img src='https://i.ytimg.com/vi/y7rjewGdwpI/maxresdefault.jpg' width='800' height='600' > ");
  } else {
    if (userFuncs.checkUserExists(req.body.username, req.body.email, users) === "login or email is unique") {
      userid = generateRandomString();
      users[userid] = {};
      users[userid].username = req.body.username;
      users[userid].email = req.body.email;
      users[userid].id = userid;
      const pswd = req.body.password;
      const hashed_password = bcrypt.hashSync(pswd, 10);
      users[userid].password = hashed_password;
      res.cookie('id', userid, { path: "/" });
      res.redirect("/");
    } else {
      res.status(400).send("user or email already exists.<img src='https://i.ytimg.com/vi/y7rjewGdwpI/maxresdefault.jpg' width='800' height='600' >");
    }
  }
});

//----------------------------
//Redirect to your long URL
//--------------------------------
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    res.redirect(urlDatabase[req.params.shortURL].url);
  } else {
    res.status(404).send("No short URL here! Sorry!");
  }
});

//---------------------------------------
//URL GETS
//---------------------------------------
app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(401).send("Yo dude <a href='/login'> login</a> first!");
  } else {
    let templateVars = {
      urls: urlDatabase.userURLs(req.session.user_id),
      username: users[req.session.user_id].username,
      email: users[req.session.user_id].email
    };
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.status(401).send("You need to <a href='/login'>login</a> to create a new short url!");
  } else {
    res.render("urls_new", users[req.session.user_id]);
  }
});

app.get("/urls/:id", (req, res) => {
  if (userFuncs.checkShortURLExists(req.params.id, urlDatabase)) {
    if (!req.session.user_id) {
      res.status(401).send("Hey maybe you should try <a href='/login'> logging in </a>?");
    } else {
      if (userFuncs.confirmOwnership(req.params.id, req.session.user_id, urlDatabase)) {
        let templateVars = {
          shortURL: req.params.id,
          longURL: urlDatabase[req.params.id],
          username: users[req.session.user_id].username,
          email: users[req.session.user_id].email,
          id: users[req.session.user_id].id
        };
        res.render("urls_show", templateVars);
      } else {
        res.status(403).send("Hey there buddy, don't touch my short URLS");
      }
    }
  } else {
    res.status(404).send("This short URL does not exist :(");
  }
});


//------------------------
// URL POSTS
//------------------------
//this is for updating a url in the database.
app.put("/urls/:id", (req, res) => {
  //confirm short url exists
  //console.log(req);

  if (userFuncs.checkShortURLExists(req.params.id, urlDatabase)) {
    //confirm session cookie
    if (req.session.user_id) {
      //confirm user owns short url
      if (userFuncs.confirmOwnership(req.params.id, req.session.user_id, urlDatabase)) {
        let longURL = req.body.longURL;
        urlDatabase[req.params.id] = {
          url: longURL,
          userid: req.session.user_id
        };
        res.redirect("/urls/?alert=success&action=update"); // this was giving me errors trying to redirect back to the update page.
      } else {
        res.status(401).send("Try logging in <a href='/login'> here </a>");
      }
    } else {
      res.status(403).send("This url doesnt belong to you!");
    }
  } else {
    res.status(404).send("sorry this doesnt exist.");
  }
});
//this is used for deleting a short URL from the database
app.delete("/urls/:id/DELETE", (req, res) => {
  console.log("deleting!");
  delete urlDatabase[req.params.id];
  res.redirect("/urls/?alert=success&action=delete"); //was going to implement some jQuery alerts for when I deleted or updated URLS but no more time.
});

//this is used for adding a new url to the database. put is safer as it will guarentee it only gets created once.
app.put("/urls", (req, res) => {
  if (req.session.user_id) {
    let newString = generateRandomString();
    urlDatabase[newString] = {
      url: req.body.longURL,
      userid: req.session.user_id
    };
    res.redirect("/urls/?alert=success&action=addnew"); // //was going to implement some jQuery alerts for when I deleted or updated URLS but no more time.
  } else {
    res.status(401).send("You can't do that sir/mama <a href='/login'>login first! </a>");
  }
});


//---------------------------------------
//Listening
//---------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
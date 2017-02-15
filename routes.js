module.exports = (app) => {
  //ROUTES!

  app.get('/register', (req, res) => {

  });

  app.post('/register', (req, res) => {

  });

  app.get("/api", (req, res) => {
    res.JSON({
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
    var templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

  app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

  app.get("/", (req, res) => {
    res.end("Hello!");
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

  app.post("/urls/:id/update", (req, res) => { //may not need to
    console.log(`Updating ${req.params.id} : change from`); // debug statement to see POST parameters
    console.log(urlDatabase[req.params.id]);
    console.log("to");
    var longURL = req.body.longURL;
    urlDatabase[req.params.id] = longURL;
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
    var templateVars = { urls: urlDatabase };
    res.redirect("/urls/?alert=success&action=delete");
  });



  app.post("/urls", (req, res) => {
    console.log(req.body); // debug statement to see POST parameters
    console.log("call randomString generator");
    let newString = generateRandomString();
    console.log(`add to database`);
    urlDatabase[newString] = req.body.longURL;
    console.log(urlDatabase);
    res.redirect("/urls/?alert=success&action=addnew"); // Respond with 301 or 304 to browser.
  });

};
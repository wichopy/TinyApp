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
ID = "9sm5xK"
console.log(visitHistory.filter(function (obj) {
  return obj.urlId == ID;
}));
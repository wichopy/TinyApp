$(document).ready(function () {

  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    //sURLVariables = sPageURL.split('&'),
    sParameterName;
  console.log(sPageURL);

  sParameterName = sPageURL.split('=');
  console.log(sParameterName);
  if (sParameterName[0] === "alert") {
    sParameterName[1] === undefined ? true : sParameterName[1];
  }


  //console.log("Check response, update alert message.");
});
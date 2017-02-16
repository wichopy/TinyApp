module.exports = function generateRandomString() {
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
};
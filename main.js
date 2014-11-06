var util = require('util');
var Twitter = require('twitter');
var fs = require('fs');
var Markov = require('./lib/markov.js').Markov;

var millisecondsPerSecond = 1000;
var secondsPerMinute = 60;
var minutesPerHour = 60;
var hoursPerDay = 24;

// posts twice per day
var postsPerDay = 3
var interval = millisecondsPerSecond * secondsPerMinute * minutesPerHour * hoursPerDay * 1/postsPerDay;

makeNewPost();
setInterval(makeNewPost, interval);


function makeNewPost() {
  var secrets = require('./config/secrets.json');
  var twit = new Twitter(secrets);

  var theGreatGatsby = readFile("res/the_great_gatsby.txt");

  twit.verifyCredentials(postIfCredentialsAreValid);

  function postIfCredentialsAreValid(data) {
    var functionName = "validation";
    if (logSuccessOrFailure(data, functionName)) {
      var status = getTweetableSentence(new Markov(theGreatGatsby));
      tweet(status);
    }
  }

  function tweet(status) {
    var functionName = "tweet";
    twit.updateStatus(status, function(data) {
      if (logSuccessOrFailure(data, functionName)) {
        console.log("just tweeted! \n  \"" + status + "\"\n");
      }
    });
  }

  function logSuccessOrFailure(data, functionName) {
    if (typeof data["statusCode"] == "undefined" || data["statusCode"] == 200) {
      console.log(functionName + " succeeded");
      return true;
    } else {
      console.log(util.inspect(data));
      console.log(functionName + " failed");
      return false;
    }
  }

  function readFile(filepath) {
    var options = {
      flags: 'r',
      encoding: 'utf8'
    }
    var file = fs.readFileSync(filepath, options);
    return file;
  }

  function getTweetableSentence(markov) {
    var sentence;
    do {
      sentence = markov.generateSentence();
    } while (sentence.length > 140);
    return sentence;
  }
}
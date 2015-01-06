var util = require('util');
var Twitter = require('twitter');
var fs = require('fs');
var Markov = require('./lib/markov.js').Markov;

// Use cron instead of javascript timeout...
// var millisecondsPerSecond = 1000;
// var secondsPerMinute = 60;
// var minutesPerHour = 60;
// var hoursPerDay = 24;
//
// posts twice per day
// var postsPerDay = 3
// var interval = millisecondsPerSecond * secondsPerMinute * minutesPerHour * hoursPerDay * 1/postsPerDay;

var NUM_SENTENCES = 1;
var NGRAMS = 3;

makeNewPost();
//setInterval(makeNewPost, interval);


function makeNewPost() {
  var secrets = require('./config/secrets.json');
  var client = new Twitter(secrets);
  
  var theGreatGatsby = loadText("res/the_great_gatsby.txt");
  var newStatus = getNewStatus();
  debugger;
  client.post('statuses/update', {status: newStatus}, logSuccessOrFailure);
  
  function logSuccessOrFailure(error, params, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(params);
      console.log(response);
    }
  }
  //twit.verifyCredentials(postIfCredentialsAreValid);
  
  function getNewStatus() {
    var markov = new Markov(theGreatGatsby, NGRAMS, NUM_SENTENCES);
    var twitterStatus = getTweetableSentence(markov);
    return twitterStatus;
  }

  function loadText(filepath) {
    var options = {
      flags: 'r',
      encoding: 'utf8'
    }
    var fileText = fs.readFileSync(filepath, options);
    return fileText;
  }

  function getTweetableSentence(markov) {
    var sentence;
    do {
      sentence = markov.generateSentences();
      debugger;
    } while (sentence.length > 140);
    return sentence;
  }
}
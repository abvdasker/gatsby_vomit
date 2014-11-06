var util = require('util');
var Twitter = require('twitter');

var secrets = require('./config/secrets.json');
var twit = new Twitter(secrets);

var theGreatGatsby = readTheGreatGatsby("res/the_great_gatsby.txt");

twit.verifyCredentials(postIfCredentialsAreValid);

function postIfCredentialsAreValid(data) {
  var functionName = "validation";
  if (logSuccessOrFailure(data, functionName)) {
    functionName = "tweet";
    tweet("");
    twit.updateStatus("hello world", function(data) {
      if (logSuccessOrFailure(data)) {
        console.log()
      }
    });
  }
}

function tweet(status) {
  
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
  var file = fs.readFileSync(path, options);
  return file;
}
var watson = require('watson-developer-cloud');
var text_to_speech = watson.text_to_speech({
  username: 'munzman',
  password: 'iamhero#1',
  version: 'v1'
});

text_to_speech.voices(null, function(error, voices) {
  if (error)
    console.log('error:', err);
  else
    console.log(JSON.stringify(voices, null, 2));
  }
);
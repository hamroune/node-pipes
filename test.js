var Pipes = require('./lib/node-pipes.js').init();

var pipes = new Pipes();

console.log('Start...');

var startTime= new Date().getTime();

var count = 0;

pipes
  
  .streamFromTwitter({
  	username: 'your username',
  	password: 'pass',
  	track: 'airbus' //a keyword hashtag
  })  

  .handler(function(tweet){
  	console.log('received tweet (id) ==>', tweet.id);  	
  })

  
 ;


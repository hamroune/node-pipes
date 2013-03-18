var Pipes = require('./lib/node-pipes.js').init();

var pipes = new Pipes();

console.log('Start...');

var startTime= new Date().getTime();

var count = 0;

pipes
  
  .streamFromCsv('data.csv', {schema: ["name", 'age', 'sexe'], separator: ';'})  

  .handler(function(person){
  	console.log('name ==> :', person.name);  	
  })

  
 ;


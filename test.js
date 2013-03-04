var Pipes = require('./lib/node-pipes.js').init();

var pipes = new Pipes();

var data = [
	{
		name: 'zahir',
		age: 33
	},
	{
		name: 'carlo',
		age: 30
	},
	{
		name: 'David',
		age: 25
	},
	{
		name: 'PA',
		age: 27
	},
	{
		name: 'Cyrille',
		age: 37
	},
	{
		name: 'JB',
		age: 31
	}
];

console.log('Start');

var startTime= new Date().getTime();

pipes
  
  .streamFrom(data)
  
  //Each 3 messages
  .aggregate('count:3', function(dataList){
  		console.log('Count ', dataList, '\n');
  })
  
  .run()

 ;

var endTime= new Date().getTime();

console.log('End duration :', endTime - startTime);

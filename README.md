node-pipes
==========

A node.js module for Easy chaining operations, a lightweight ETL:

```bash
$ npm install node-pipes
```

Then import it into your project:

```js
//Initilze The Node Pipes
var Pipes = require('./lib/node-pipes.js').init();

//Instance
var pipes = new Pipes();

//Sample data
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

//ENJOY WITH PIPES

pipes
  
  .streamFrom(data)

  .heandler(function(message){
  	console.log('Current Message', message);
  })
  
  //Each 3 messages
  .aggregate('count:3', function(dataList){
  		console.log('Count ', dataList, '\n');
  })
  
  .run()

 ;

```


if you want a time window,


```js
pipes
  
  .streamFrom(data)
  
  //WINDOWING 
  .aggregate('time:300', function(dataList){
  		console.log('Grouped Data each 300 ms ', dataList, '\n');
  })
  
  .run()

 ;

```


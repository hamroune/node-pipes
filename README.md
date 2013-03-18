node-pipes
==========

A node.js module for Easy chaining operations, a lightweight ETL:

```bash
$ npm install node-pipes
```

Then import it into your project:

```js
//Initilze The Node Pipes
var Pipes = require('node-pipes').init();

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


```


Simple Handlet
```
pipes
  
  .streamFrom(data)

  .handler(function(message){
  	//handle each input message
  	console.log('Current Message', message);
  })   

  .run()
 ;

```

Filtrage
```
pipes
  
  .streamFrom(data)

  .filter(function(message){
  	return message.age >= 30
  }) 
  
  .handler(function(message){
  	//Only messages that age >= 30 are handled
  	console.log('Only age >=30', message);
  })   
  
  .run()

 ;

```

Aggregation Computation
```
pipes
  
  .streamFrom(data)
  
  //Each 3 messages
  .aggregate('count:3', function(dataList){
  	console.log('Count ', dataList, '\n');
  })
  
  .run()

 ;

```



Windowing

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

Streaming Twitter

```
pipes
  
  .streamFromTwitter({
  	username: 'your user name',
  	password: 'your password',
  	track: '#airbus'
  })  

  .handler(function(tweet){
  	console.log('received tweet', tweet);  	
  })

```


Stream from CSV file
```
pipes
  
  .streamFromCsv('data.csv', {schema: ["name", 'age', 'sexe'], separator: ';'})  

  .handler(function(person){
  	console.log('name ==> :', person.name);  	
  })

;
```
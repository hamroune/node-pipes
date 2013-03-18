var _ = require('underscore');
var nodeEventer = require('node-eventer').init();
var request = require('request');

var UNDEFINED;

/*
* Main Class 
*/
Pipes = function(){

	var _this = this;

	var keys = [];

	var data;

	var cache = {}; //should be in real cache like Redis to scale

	this.streamFrom =  function(in_data){
		data = in_data;

		keys.push('source');

		return _this;
	};


	this.streamFromTwitter =  function(args){

		this.params = args;
		var _this = this;

		keys.push('source');

		function filter(options, callback){
		  var params = {
		    uri: "https://stream.twitter.com/1/statuses/filter.json",
		  }
		  if (typeof options['oauth'] !== 'undefined'){
		    params.oauth = options.oauth;
		    delete options.oauth;
		  }
		  else if (typeof options['basic'] !== 'undefined') {
		    params.uri = params.uri.replace(/^https?:\/\//,
		       'https://' + options.basic.username + ':' + options.basic.password + '@'
		    );
		    delete options.basic;
		  }
		  params.form = options;
		  
		  var req = request.post(params, function(err, response, body){
		    if (err) console.error(err);
		  });
		  // The callback for request.post is called when the response returns so you
		  // have to save the post object and add a callback for the data event.
		  req.on('data', function(buffer){
		    //console.log('Received buffer', buffer+'');
		    var tweet;
		    try{
		        tweet = JSON.parse(buffer+'');
		    }catch (e){
		        tweet = (buffer+'');
		    }    
		    callback(tweet);
		  });
		};
		 
		filter({ basic: { username: _this.params.username, password: _this.params.password }, track: _this.params.track }, 
		  function(tweet) { 

		  	nodeEventer.publish(keys[0], tweet);
		    //console.log('Id',tweet.id, '\n user :', (tweet.user) ? tweet.user.name : 'UNKNOWN'); 
		}
		);

















		return _this;
	};

	this.handler = function(handlerFn){
		var key = _.last(keys);
		
		var r = (new Date()).getTime()+Math.floor((Math.random()*10)+1);

		var nKey = 'handler'+r;

		keys.push(nKey);
		
		nodeEventer.subscribe(key, function(message){
	
			if(handlerFn){
				handlerFn(message);
		
				var nextIndex;
		
				_.find(keys, function(k, index){

					if(k == nKey){
						nextIndex = index;
						return true
					}
					return false;

				});

				var nextKey = keys[nextIndex];

				nodeEventer.publish(nextKey, message);
			};
	
		});

		return _this;
	};

	/* Filter Barrier*/
	this.filter = function(handlerFn){
		var key = _.last(keys);

		var r = (new Date()).getTime()+Math.floor((Math.random()*10)+1);

		var nKey = 'filter'+r;

		keys.push(nKey);

		//console.log(color.green('in Filter we listen to ')+key);

		nodeEventer.subscribe(key, function(message){
	
			var canForwardMessage =  (handlerFn && handlerFn(message))? true: false;
	
			if(canForwardMessage){
				
				var nextIndex;

				_.find(keys, function(k, index){

					if(k == nKey){
						nextIndex = index;
						return true
					}
					return false;

				});		

				var nextKey = keys[nextIndex];

				if(nextKey !== 'end'){
					//console.log(' Next in Filter Key ==>', nextKey);
					nodeEventer.publish(nextKey, message);
				}
			}
		});
		
		return _this;
	};

	/*Aggregate a list of events into a aggregate array of messages*/
	this.aggregate = function(query, callback){

    	var key = _.last(keys);

    	var isCounting = query.split(':')[0] == 'count';

		var r = (new Date()).getTime()+Math.floor((Math.random()*10)+1);

		var nKey = 'aggregate'+r;

		keys.push(nKey);

    	if(isCounting){

    		var count = parseInt(query.split(':')[1],10);

			nodeEventer.subscribe(key, function(message){

				if(cache[''+nKey+''] == UNDEFINED){
					cache[''+nKey+''] = [];
				}

				cache[''+nKey+''].push(message);

				var size = cache[''+nKey+''].length ;

				var nextIndex;
					
					_.find(keys, function(k, index){

						if(k == nKey){
							nextIndex = index;
							return true
						}
						return false;

					});		

					var nextKey = keys[nextIndex];


				if(size >= count){

					var data = (cache[''+nKey+'']);

				    
					if(nextKey !== 'end'){
						callback(data);
					}

					cache[''+nKey+''] = [];
				};		


				if(nextKey !== 'end'){
					nodeEventer.publish(nextKey, message);	
				}

			});

    	}else{
    		var delay = parseInt(query.split(':')[1],10);

 			var nextIndex;
						
			_.find(keys, function(k, index){

					if(k == nKey){
						nextIndex = index;
						return true
					}
					return false;

			});	

			var nextKey = keys[nextIndex];
			
			nodeEventer.subscribe(key, function(message){
				if(cache[''+nKey+''] == UNDEFINED){
					cache[''+nKey+''] = [];
				}

				cache[''+nKey+''].push(message);

	    		if(nextKey !== 'end'){
					nodeEventer.publish(nextKey, message);	
				}
						
			});
    		
	    	setInterval(function(){

	             		var data = (cache[''+nKey+'']);

						var nextKey = keys[nextIndex];

	    				if(nextKey !== 'end' && data && data.length > 0){
	    					console.log('setInterval', data.length);
							callback(data);
						}

						cache[''+nKey+''] = [];

			}, delay);
    		
    	}
    	
		return _this;
	};

	this.run= function(){
		var firstKey = keys[0];
		
		keys.push('end');

		_.each(data, function(message){
			nodeEventer.publish(firstKey, message);				
		});
	}

};

/*
* Initilze Module
*/
exports.init = function(){
	return Pipes;
};
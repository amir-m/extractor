console.log('parent: %s', process.pid);

var ruleCount = 4,
	rules = {
		1: {
			id: 1, // done
			offset: 0,
			limit: 25,
			tick: 500,
			nodeCount: 1, 
			nodesLeft: 50,
			extractor: 'trackExtractor',
			query: { 
				tracksStatus: 0,
				track_count: {$gt: 110}
			},
			updates: {
				tracksStatus: 1
			}
		},
		2: {
			id: 2, // 13 nodes still have trackStatus: 1
			offset: 0,
			limit: 50,
			tick: 1000,
			nodeCount: 1, 
			nodesLeft: 50,
			extractor: 'trackExtractor',
			query: { 
				tracksStatus: 0,
				track_count: {$gt: 30, $lte: 110}
			},
			updates: {
				tracksStatus: 1
			}
		},
		3: {
			id: 3, // 1055 nodes still left, 35 nodes with status: 1, 4582 finished
			offset: 0,
			limit: 50,
			tick: 1000,
			nodeCount: 1, 
			nodesLeft: 50,
			extractor: 'trackExtractor',
			query: { 
				tracksStatus: 0,
				track_count: {$gt: 20, $lte: 30}
			},
			updates: {
				tracksStatus: 1
			}
		},
		4: {
			id: 4,
			offset: 0,
			limit: 50,
			tick: 500,
			nodeCount: 1, 
			nodesLeft: 50,
			extractor: 'trackExtractor',
			query: { 
				tracksStatus: 0,
				track_count: {$gt: 14, $lte: 20}
			},
			updates: {
				tracksStatus: 1
			}
		}
	};

prepare(require('child_process').fork(__dirname + '/child.js'), rules[4]);

function prepare(child, message) {
	child.on('message', function(message){
		console.log('killing %s', child.pid);
		child.kill();
		global.gc();
		if (message.finished) {
			console.log('rule %s finished.', message.id);
			return scheduleNext(message.id + 1);
		}
		delete message.finished;
		return prepare(require('child_process').fork(__dirname + '/child.js'), message);
	});
	child.send(message);
};

global.gc();

function scheduleNext(index) {
	if (index > ruleCount) {
		return console.log('all rules finished.');
	}
	console.log('rule %s scheduled in 5 seconds', index);
	setTimeout(function(){
		prepare(require('child_process').fork(__dirname + '/child.js'), rules[index]);
		global.gc();
	}, 1000*60*45);
	global.gc();

};

// require('http').createServer().listen();

// tracks 1 Wayvee
// tracks 2 Tough Love Music
// tracks 3 Disco Deviance
// tracks 4 Tough Love Music

// var https = require('https'),
// 	colors = require('colors'),

// 	USER_ID = 11121738,
// 	CLIENT_ID = 'bef6a6c0fd5e4182ac9d366068d426ac',
// 	CLIENT_SERCRET = '9ea85c6c796b38b617ac39afbc207d60',
// 	apiUri = 'https://api.soundcloud.com/',
// 	clientIdQuery = '.json?client_id=' + CLIENT_ID + '&offset=',
// 	start, node, totalTimeElapsed, inc, dec;	

// colors.setTheme({
// 	silly: 'rainbow',
// 	input: 'grey',
// 	verbose: 'cyan',
// 	prompt: 'grey',
// 	info: 'green',
// 	data: 'grey',
// 	help: 'cyan',
// 	warn: 'yellow',
// 	debug: 'blue',
// 	error: 'red'
// });

// // init();
// // findCollision();
// // removeCollision();


// // for (var i = 0; i < 60; ++i)
// // 	(function(i){
// // 		setTimeout(function() {
// // 			console.log(i)
// // 		}, i * 800)
// // 	}(i));
// // var i = 0;
// // models.User.find({depth: 1})
// // exec(function(error, users) {

// // 	if (error) throw error;

// // 	trackScraper(0, users[i], i);

// // });

// models.ready(function(db){
	
// 	console.log('models are now ready...'.input);

// 	var users = db.collection('users');
// 	inc = 1, dec = 0, start = new Date().getTime();

// 	// scrap(0);

// 	// console.log(require('os').cpus().length)

// 	// models.User.findOne({username: 'vizio'}, function(error, user){
// 	// 	if (error) throw error;
// 	// 	console.log(user.tracks);
// 	// 	user.tracks = [];
// 	// 	user.save();
// 	// 	// user = null;
// 	// });

// });

// var nextTick = (function (){
// 	ticker = 0;
// 	return function() {
// 		return ticker += 1000;
// 	}
// }());

// function scrap(index) {
	
// 	console.log('scrap next %s'.verbose, index + 200);

// 	models.User.find({ 
// 		depth: {$lte: 2},
// 		tracksStatus: 0
// 	})
// 	.skip(index)
// 	.limit(200)
// 	.exec(function(error, docs){
		
// 		if (error) throw error;

// 		if (!docs || docs.length == 0) return;
		
// 		for (var i = 0; i < docs.length; ++i) {

// 			docs[i].tracksStatus = 1;

// 			docs[i].save();

// 			(function(i){
					
// 				setTimeout(function(){
// 					console.log('tracks %s %s'.input, inc, docs[i].username);
// 					trackScraper(0, docs[i], inc);
// 					inc++;
// 					++dec;
// 				}, nextTick());

// 			}(i));
// 		}
// 		setTimeout(function(){
// 			scrap(index+200);
// 		})
// 	});
// };


// function crawl() {
	
// 	var start = new Date().getTime();

// 	models.User.findOne({ $and: [
// 		// {scheduled: false}, 
// 		// {depth: {$lte: 2}},
// 		{depth: 2},
// 		{followerStatus: 0} 
// 	]}, function(error, node) {
		
// 		if (error) throw error;

// 		if (node) {

// 			models.User.update({id: node.id}, {$set:{
// 				scheduled: false,
// 				followerStatus: 1,
// 				// followingStatus: 1,
// 			}}, function (error) {
// 				if (error) throw error;
// 				console.log('%s node %s on %s.', 'Staring'.verbose,
// 					node.username.info, new Date());

// 				crawlFollowers(0, node, start);
// 				// crawlFollowings(0, node, start);

// 				// setTimeout(function(){

					
// 				// }, 3000);
// 			});
// 		}
// 		else {
// 			console.log('Not found');
// 		}

// 	});
// };

// function followingScraper(offset, node, index) {

// 	var path = node.uri + '/followings' + clientIdQuery + offset;

// 	node.offset = offset;
// 	node.save();
	
// 	https.get(path, function(res) {

// 		var _data = '';

// 		if (res.statusCode != 200) console.log((res.statusCode.toString()).error)
		
// 		res.on('data', function (chunck) {
// 			_data += chunck.toString('utf8');
// 		});

// 		res.on('end', function () {
			
// 			data = JSON.parse(_data);

// 			for (var i = 0; i < data.length; ++i) {

// 				data[i]['depth'] = node.depth + 1;

// 				for (var j in data[i]) {
// 					if (data[i][j] == null) delete data[i][j];
// 				}
							
// 				node.followings.push(data[i].id);
// 				node.save();
				
// 				(function(data){

// 					models.User.findOne({id: data.id}, function(error, user){
						
// 						if (error) throw error;

// 						if (user) {
// 							user.followers.push(node.id);
// 							user.save();
// 						}
// 						else {
							
// 							models.User.create(data, function(error){
// 								if (error) throw error;
// 							});
							
// 						}
// 					});

// 				}(data[i]));
// 			}

// 			offset = (offset == 0 ? 51 : offset + 50);
			
// 			if (offset > node.followings_count || offset > 500) {

// 				node.followingStatus = 2;
// 				node.save();

// 				--dec;

// 				console.log('following %s %s %s, %s left '.input, node.username, 'scraped'.info, 
// 					index, dec.toString().warn);

// 				if (1 == dec) 
// 					console.log('Successfully scraped %s nodes'.info, index);

// 				return;
// 			}
// 			else 
// 				followingScraper(offset, node, index);
// 		});

// 	}).on('error', function(e) {
// 		console.log("Got error: " + e.message);
// 	});
// };

// function crawlFollowers(offset, node, start) {

// 	// if (node.scheduled) return;

// 	if (offset > node.followers_count || offset > 500) {

// 		// console.log('%s node %s at depth %s in %s ms at %s.', 'Follower'.warn,
// 		// 	node.username.info, (node.depth).toString().info, 
// 		// 	(new Date().getTime() - start).toString().info, new Date());

// 		++totalFollowerCrawls;

// 		models.User.update({id: node.id}, {$set:{
			
// 			followerStatus: 2,

// 		}}, function (error) {
// 			if (error) throw error;

// 		});
		
// 		// console.log('Finished total of %s nodes at depth %s at %s ms on %s'.info, 
// 		// totalFollowerCrawls, node.depth, new Date().getTime() - totalTimeElapsed, 
// 		// new Date());

// 		return crawl();
// 	};

// 	// console.log('Fetching followers of node %s with offeset %s.', 
// 	// 	node.username.info, (offset.toString()).info);

// 	var path = node.uri + '/followers' + clientIdQuery + offset
	
// 	https.get(path, function(res) {

// 		var _data = '';

// 		if (res.statusCode != 200) console.log((res.statusCode.toString()).error)
		
// 		res.on('data', function (chunck) {
// 			_data += chunck.toString('utf8');
// 		});

// 		res.on('end', function () {
			
// 			data = JSON.parse(_data);

// 			for (var i = 0; i < data.length; ++i) {

// 				data[i]['depth'] = node.depth + 1;
// 				data[i]['number'] = number++;

// 				for (var j in data[i]) {
// 					if (data[i][j] == null) delete data[i][j];
// 				}
							
// 				models.User.update({id: node.id}, {$push: { 
// 					followers : data[i].id
// 				}}, function (error) {
// 					if (error) throw error;
// 				});
				
// 				(function(data){

// 					models.User.findOne({id: data.id}, function(error, user){
						
// 						if (error) throw error;

// 						if (user) {
// 							models.User.update({id: user.id}, {$push: { 
// 								followings : node.id
// 							}}, function (error) {
// 								if (error) throw error;
// 							});
// 						}
// 						else {
							
// 							models.User.create(data, function(error){
// 								if (error) throw error;
// 							});
							
// 						}
// 					});

// 				}(data[i]));
				
// 			}
			
// 			crawlFollowers((offset == 0 ? 51 : offset + 50), node, start);

// 		});

// 	}).on('error', function(e) {
// 		console.log("Got error: " + e.message);
// 	});
// };

// function init () {
// 	var path = apiUri + 'users/' + USER_ID + clientIdQuery + 0,
// 		data = '';

// 	totalTimeElapsed = new Date().getTime();
// 	https.get(path, function(res) {
		
// 		res.on('data', function (chunck) {
// 			data += chunck.toString('utf8');
			
// 		});
// 		res.on('end', function () {
// 			node = JSON.parse(data);
// 			node['depth'] = 1;
// 			node['number'] = number++;
// 			// console.log(node);
// 			for (var i in node)
// 				if (node[i] == null) delete node[i];
// 			// console.log(node);
// 			models.User.create(node, function(error){
// 				if (error) throw error;
// 				// crawl();
// 			});
// 		});
// 	}).on('error', function(e) {
// 		console.log("Got error: " + e.message);
// 	});
// };


// function findCollision(){
	
// 	models.User.find({scheduled: true})
// 	.lean()
// 	.exec(function(error, users){

// 		if (error ) throw error

// 		for (var k in users) {

// 			var user = users[k];

// 			// console.log(user)

// 			var followings = [], followers = [], ingfound = 0, ersfound = 0;

// 			for (var i = 0; i < user.followings.length; ++i) {

// 				if (user.followings[i].id in followings) ++ingfound;
// 				else 
// 					followings[user.followings[i].id] = true;
// 					// (user.followings[i].id in followings) console.log('found'.error);

// 			}
// 			console.log('%s collsions total %s followings %s', 
// 				ingfound, user.followings.length, user.username);
// 			for (var i = 0; i < user.followers.length; ++i) {

// 				if (user.followers[i].id in followers) ++ersfound
// 				else 
// 					followers[user.followers[i].id] = true;

// 			}
// 			console.log('%s collsions total %s followers %s',  
// 				ersfound, user.followers.length, user.username);
// 		}

// 	});

// }

// function removeCollision(){
	
// 	models.User.find({scheduled: true})
// 	.lean()
// 	.exec(function(error, users){

// 		if (error ) throw error

// 		for (var k in users) {

// 			var user = users[k], flag = false;

// 			var followings = [], followers = [], ingfound = 0, ersfound = 0;

// 			for (var i = 0; i < user.followings.length; ++i) {

// 				if (followings.indexOf(user.followings[i].id) != -1) {
// 					followings.splice(followings.indexOf(user.followings[i].id), 1);
// 					flag = true;
// 				}
// 				else 
// 					followings.push(user.followings[i].id);

// 			}

// 			for (var i = 0; i < user.followers.length; ++i) {

// 				if (followers.indexOf(user.followers[i].id) != -1) {
// 					followers.splice(followers.indexOf(user.followers[i].id), 1);
// 					flag = true;
// 				}
// 				else 
// 					followers.push(user.followers[i].id);

// 			}

// 			if (flag)

// 				models.User.update({id: user.id}, {$set: {
// 					followers: followers,
// 					followings: followings	
// 				}}, function(error) {
// 					if (error) throw error;
// 				});
			
// 		}

// 	});

// }

// // models.User.aggregate( [ { $group: { 
// // username: 0, 
// // first: { $min: "$followingBegins"},
// // last:  { $max: "$followingEnds"} } } ] );

// // data = {
// // 	uri: 'looloo',
// // 	username: 'dooosh',
// // 	id: 1872627,
// // 	followings_count: 10,
// // 	followers_count: 14,
// // 	followers: []
// // }


// // models.User.find({ $and: [
// // 		{scheduled: false}, 
// // 		// {depth: {$lte: 2}},
// // 		{depth: {$lte: 2}} 
// // 	]}, function(error, node) {
		
// // 		if (error) throw error;
		
// // 		console.log(node);

// // 	});

// // models.User.findOne({username: 'vizio'}, function(error, node) {

// // 	if (error) throw error;

// // 	// console.log(node.followings.length);

// // 	models.User.find( { id: { $in: node.followings } }, function (error, docs) {
// // 		if (error) throw error;
// // 		// console.log(docs.length);		
// // 		for (var i in docs)		
// // 			if (docs[i].depth == 3) console.log(docs[i].username);		
// // 		// console.log(i, docs[i].followingStatus, docs[i].followerStatus);
// // 	});

// // 	// models.User.update( { id: { $in: node.followings } }, { $set: { depth: 2 } }, {multi: true},
// // 	// 	function (error, docs) {
// // 	// 	if (error) throw error;
		
// // 	// });

// // });





















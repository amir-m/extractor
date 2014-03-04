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

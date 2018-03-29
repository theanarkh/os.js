var TASKNUM = 10;
	var STATE = {
		RUNNING: 0,
		HANGON: 1,
		STOP: 2
	};
	var DEFAULTPRI = 10;
	var lastPid = 0;
	function Task() {
		this.pid = lastPid++;
		this.state = STATE.RUNNING;
		this.priority = DEFAULTPRI;
		this.executeTime = 0;
	
	}

	Task.prototype = {
		run: function() {
			// nothing to do
		},
		
		init: function() {

		}
	}
	var RUNTIME = 10;
	var TASKS = [];//new Array(TASKNUM);
	var current;
	function schedule() {
		var i = 0;
		TASKS = TASKS.sort(function(a, b) {
			return a.priority < b.priority;
		});
		
		while(i < TASKNUM) {
			
			current = TASKS[i];
			i++;
			if (current && current.state == STATE.RUNNING) {
				var startTime = Date.now();
				current.run();
				var endTime = Date.now();
				current.executeTime += endTime - startTime;
				if ((endTime - startTime)  > RUNTIME) {
					current.priority && current.priority--;
				}
				break;
			}
		}
	}

	function sleep(param) {
		param.push(current);
		current.state = STATE.HANGON;
	}


	function wakeup(param) {
		var task = param.shift();
		task.state = STATE.RUNNING;
	}

	function removeTask() {
		var i = 0;
		while(i < TASKS.length) {
			if (TASKS[i].pid == current.pid) {
				TASKS.splice(i, 1);
				return;
			}
		}
	}
var LEN = 8;
var buf = {
	buffer: new Array(LEN),
	read: 0,
	write: 0,
	len: 0,
	readQueue: [],
	writeQueue: []
}

var INC = function(ptr) {
	return (ptr + 1 ) & (LEN -1);
};

function read(len) {
	var readableLen = buf.len;
	if (!readableLen && len) {
		sleep(buf.readQueue);
		return -1;
	}
	var realLen = len > readableLen ? readableLen : len;
	var i = 0;
	var data = [];
	while(i < realLen) {
		data.push(buf.buffer[buf.read]);
		buf.len--;
		buf.read = INC(buf.read);
		i++;
	}
	if (realLen && buf.writeQueue.length) {
		wakeup(buf.writeQueue)
	}
	return data;
}


function write(data) {
	var writableLen = (LEN - buf.len);
	if (!writableLen && data.length) {
		sleep(buf.writeQueue);
		return -1;
	}
	var realLen = data.length > writableLen ? writableLen : data.length;
	var i = 0;
	while(i < realLen) {
		buf.buffer[buf.write] = data[i];
		buf.len++;
		buf.write = INC(buf.write);
		i++;
	}
	if (realLen && buf.readQueue.length) {
		wakeup(buf.readQueue);
	}
	return realLen;
}


var task0 = new Task();
task0.run = function() {
	this.priority = -1;
	console.log('run 0');
}
var task1 = new Task();
task1.init = function() {
	
	this.data = [1,2,3,4,5,7,8,9,11];
}
task1.run = function() {
	console.log('run 1')
	var sourcelen = this.data.length;
	if (!sourcelen) {
		return;
	}

	var writeLen = write(this.data);
	if (writeLen == -1) {
		return ;
	}
	if (writeLen == sourcelen) {
		var self = this;
		setTimeout(function() {
			self.data = 'a'.repeat(~~(Math.random() * 20) + 1).split('');

		},2000)
		//removeTask();
	} else {
		this.data = this.data.slice(writeLen);
	}
};

var task2 = new Task();
task2.init = function() {
	this.data = [];
}
task2.run = function() {
	console.log('run 2')

	var data = read(~~(Math.random() * 10));
	if (data == -1) {
		return ;
	}
	this.data = this.data.concat(data);
	console.log(this.data);
	// if (this.data)
	// 	TASKS.splice(this.pid, 1);
};
task0.init();
task1.init();
task2.init();
TASKS.push(task0);
TASKS.push(task1);
TASKS.push(task2);

setInterval(function() {
	schedule();
}, RUNTIME * 100)

var events = require('events');

function Range (options) {
	/*
	types: 
		l0: unlimited upperBound, lowerBound = 0
	*/
	var options = options || {};
	this.type = options.type || 'l0'
	this.lowerBound = options.lowerBound || 0;
	this.value = options.value || 0;
	this.upperBound = options.upperBound || 0;
	events.EventEmitter.call(this);
};

require('util').inherits(Range, events.EventEmitter);

Range.prototype.increment = function(value) {
	var value = value || 1;
	this.value += value;

	this.emit('change', this.value);

	if (this.type == 'l0' && this.value <= this.lowerBound) 
		this.emit('lower');
};

Range.prototype.set = function(lower, upper, value) {
	this.lowerBound = lower || this.lowerBound;
	this.upperBound = upper || this.upperBound;
	this.value = value || this.value;
	this.emit('set', this.lowerBound, this.upperBound, this.value);
};


module.exports = {
	Range: Range
}

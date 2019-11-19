define(function(require) {

	var ConditionEditor = require('./conditionEditor');

	var ctor = function() {
		// TODO: Make dynamic
		this.currencyTypes = ["Lyra", "Deeds", "Demerits", "Health"];
	};
	
	ConditionEditor.baseOn(ctor);
	return ctor;
}); 

define(function(require) {
	var ctor = function(attributes) {
		attributes = attributes || {};

		this.type = ctor.type;
		this.reputation = attributes.reputation || 0;
	};

	ctor.displayName = "Starting Reputation";
	ctor.type = "components.reputationComponent";

	var compatibleTypes = ['actor'];
	ctor.isCompatibleWith = function(entity) {
		return compatibleTypes.indexOf(entity.type) != 1;
	};

	return ctor;
	
});

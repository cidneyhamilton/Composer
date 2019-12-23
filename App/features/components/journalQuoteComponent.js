define(function(require) {
	var ctor = function(attributes) {
		attributes = attributes || {};

		this.type = ctor.type;
		this.quote = attributes.quote || "";
	};

	ctor.displayName = "Journal Quote";
	ctor.type = "components.journalQuoteComponent";

	var compatibleTypes = ['actor'];
	ctor.isCompatibleWith = function(entity) {
		return compatibleTypes.indexOf(entity.type) != 1;
	};

	return ctor;
	
});

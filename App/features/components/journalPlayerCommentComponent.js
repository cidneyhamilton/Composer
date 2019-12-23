define(function(require) {
	var ctor = function(attributes) {
		attributes = attributes || {};
		attributes.comments = attributes.comments || [];
		
		this.type = ctor.type;
		this.comments = attributes.comments;		
	};

	ctor.displayName = "Player's Comments about Character in Journal";
	ctor.type = "components.journalPlayerCommentComponent";

	var compatibleTypes = ['actor'];
	ctor.isCompatibleWith = function(entity) {
		return compatibleTypes.indexOf(entity.type) != 1;
	};

	return ctor;
	
});

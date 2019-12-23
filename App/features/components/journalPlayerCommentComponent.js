define(function(require) {
	var ctor = function(attributes) {
		attributes = attributes || {};

		this.type = ctor.type;
		this.lowcomment1 = attributes.lowcomment1 || "";
		this.lowcomment2 = attributes.lowcomment2 || "";
		this.lowcomment3 = attributes.lowcomment3 || "";

		this.mediumcomment1 = attributes.mediumcomment1 || "";
		this.mediumcomment2 = attributes.mediumcomment2 || "";
		this.mediumcomment3 = attributes.mediumcomment3 || "";
		
		this.highcomment1 = attributes.highcomment1 || "";
		this.highcomment2 = attributes.highcomment2 || "";
		this.highcomment3 = attributes.highcomment3 || "";		
	};

	ctor.displayName = "Player's Comments about Character in Journal";
	ctor.type = "components.journalPlayerCommentComponent";

	var compatibleTypes = ['actor'];
	ctor.isCompatibleWith = function(entity) {
		return compatibleTypes.indexOf(entity.type) != 1;
	};

	return ctor;
	
});

define(function(require) {
    var ctor = function(attributes) {
	attributes = attributes || {};
	attributes.comments = attributes.comments || [];
	
	this.type = ctor.type;
	this.comments = attributes.comments;
	this.notes = attributes.notes || [];
    };
    
    ctor.displayName = "Player's Comments about Character in Journal";
    ctor.type = "components.journalPlayerCommentComponent";
    
    var compatibleTypes = ['actor'];
    ctor.isCompatibleWith = function(entity) {
	return compatibleTypes.indexOf(entity.type) != 1;
    };

    ctor.prototype.localize = function(localizationId, context) {
	var note, comment;
	for (var i = 0; i < comments.length; i++) {
	    comment = comments[i];
	    if (i < notes.length) {
		note = notes[i];
	    }
	    context.addLocalizationEntry(comment, note);
	}

    };
    
    return ctor;
    
});

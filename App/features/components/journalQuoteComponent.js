define(function(require) {
    var ctor = function(attributes) {
	attributes = attributes || {};
	
	this.type = ctor.type;
	this.quote = attributes.quote || "";
	this.notes = attributes.notes || "";
    };
    
    ctor.displayName = "Journal Quote";
    ctor.type = "components.journalQuoteComponent";
    
    var compatibleTypes = ['actor'];
    ctor.isCompatibleWith = function(entity) {
	return compatibleTypes.indexOf(entity.type) != 1;
    };

    // Allow the journal to be translated.
    ctor.prototype.localize = function(context) {
	context.addLocalizationEntry(this.quote, this.quote);
    };
    
    return ctor;
    
});

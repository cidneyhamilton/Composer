define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.name = attributes.name;
        this.isDeed = attributes.isDeed;
        this.notify = (attributes.notify == null) ? true : attributes.notify;

        this.description = attributes.description;
        
        this.notes = attributes.notes || "";
    };

    ctor.type = 'nodes.addJournalEntry';
    ctor.displayName = 'Journal Entry';

    ctor.prototype.localize = function(context){
        context.addLocalizationEntry(this.id + "_Name", this.name);
        delete this.name;

        context.addLocalizationEntry(this.id + "_Description", this.description, this.notes);
        delete this.description;
    };

    return ctor;
});
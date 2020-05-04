define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes, editorCreate) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.actorId = attributes.actorId;
        this.header = attributes.header;
        this.text = attributes.text;
        this.emotion = attributes.emotion;
        this.options = attributes.options || [];

        this.notes = attributes.notes || "";

        if(editorCreate){
            var assetDatabase = require('infrastructure/assetDatabase');
            this.actorId = assetDatabase.actors.entries[0].id;
        }
    };

    ctor.type = 'nodes.questionAndAnswer';
    ctor.displayName = 'Q&A';

    ctor.prototype.localize = function(localizationId, context){
        var localizationIdBase = localizationId + " Q&A ";
        context.addLocalizationEntry(localizationIdBase + "Header", this.id + "_header", this.header);
        context.addLocalizationEntry(localizationIdBase + "Question", this.id, this.text, this.notes);
        delete this.text;
        var i = 0;
        this.options.forEach(function(x){
            if(x.localize){
                x.localize(localizationIdBase + "Answer #" + (i++), context);
            }
        });
    };

    return ctor;
});

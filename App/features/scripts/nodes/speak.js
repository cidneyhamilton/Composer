define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes, editorCreate) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.actorId = attributes.actorId;
        this.actorId2 = attributes.actorId2 || null;

        this.text = attributes.text;
        this.emotion = attributes.emotion;
        this.emotion2 = attributes.emotion2;

        this.device = attributes.device;
        this.device2 = attributes.device2;

        this.notes = attributes.notes || "";

        if(editorCreate){
            var assetDatabase = require('infrastructure/assetDatabase');
            this.actorId = assetDatabase.actors.entries[0].id;

            // Find Shawn and set as default
            this.actorId = "30ee2636-15e3-452e-a2db-09cbb9012970";
        }
    };

    ctor.type = 'nodes.speak';
    ctor.displayName = 'Speak';

    ctor.prototype.localize = function(context){
        var db = require('infrastructure/assetDatabase');
        var localActorId = this.actorId;
        var actors = db.actors.entries.filter(function(entry) {
          return entry.id == localActorId;
        });
        context.addLocalizationEntry(this.id, this.text, this.notes, actors[0].name);
        delete this.text;
    };

    return ctor;
});
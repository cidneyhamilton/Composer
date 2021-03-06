define(function(){
    var system = require('durandal/system');

    var ctor = function(attributes){
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.text = attributes.text || '';
        this.nodes = attributes.nodes || [];
        this.expression = attributes.expression || null;
        this.ignoreChildAvailability = attributes.ignoreChildAvailability || false;
        this.minutes = attributes.minutes || 0;
        this.ExitMenu = attributes.ExitMenu || false;
        this.notes = attributes.notes || "";
    };

    ctor.displayName = 'Text';
    ctor.type = 'options.text';

    ctor.prototype.localize = function(localizationId, context){
        context.addLocalizationEntry(localizationId, this.id, this.text, this.notes);
        delete this.text;

        var i = 0;
        this.nodes.forEach(function(x){
            if(x.localize){
                x.localize(localizationId + " Option # " + (i++), context);
            }
        });
    };

    return ctor;
});
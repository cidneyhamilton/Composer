define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.id = attributes.id;
        this.name = attributes.name;
        this.displayName = attributes.displayName;
        
        this.components = attributes.components || [];
        this.notes = attributes.notes || "";
    };

    ctor.type = 'scene';

    ctor.prototype.localize = function(context){
        var actualDisplayName = (!!this.displayName) ? this.displayName : this.name;
        var localizationIdBase = 'Scene: ' + actualDisplayName;
        context.addLocalizationEntry(localizationIdBase, this.id, actualDisplayName, this.notes);
        delete this.name;
    };

    return ctor;
});
define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

        this.id = attributes.id;
        this.name = attributes.name;
        this.description = attributes.description;
        this.components = attributes.components || [];
        this.notes = attributes.notes || "";
        this.sceneId = attributes.sceneId;
        this.value = attributes.value || 0;
        this.weight = attributes.weight || 0;
        this.displayName = attributes.displayName;
    };

    ctor.type = 'prop';

    ctor.prototype.localize = function(context){
        var actualDisplayName = (!!this.displayName) ? this.displayName : this.name;
        var localizationIdBase = 'Prop: ' + actualDisplayName + "(" + this.id + ")";
        context.addLocalizationEntry(localizationIdBase, this.id, actualDisplayName);
        delete this.name;

        context.addLocalizationEntry(localizationIdBase + " (Description)", this.id + '_Description', this.description, this.notes);
        delete this.description;
    };

    return ctor;
});
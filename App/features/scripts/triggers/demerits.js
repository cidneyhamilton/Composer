define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.gotDemerits';
    ctor.displayName = 'Demerits';
    ctor.restrictions = ['actor', 'scene'];
    return ctor;
});
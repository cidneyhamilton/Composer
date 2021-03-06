define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.playerBomb';
    ctor.displayName = 'Player La Boomba';
    ctor.restrictions = ['scene'];
    return ctor;
});

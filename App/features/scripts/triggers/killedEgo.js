define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.killedEgo';   // If the actor enters combat at anytime and the player looses that combat by any means.
    ctor.displayName = 'KilledEgo';
    ctor.restrictions = ['actor'];
    return ctor;
});
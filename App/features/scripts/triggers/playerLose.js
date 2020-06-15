define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.playerLose';
    ctor.displayName = 'Player Lose';
    ctor.restrictions = ['scene'];
    return ctor;
});

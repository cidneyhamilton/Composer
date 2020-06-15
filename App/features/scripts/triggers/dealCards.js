define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || ctor.displayName;
    };

    ctor.type = 'triggers.dealCards';
    ctor.displayName = 'Deal Poker Cards';
    ctor.restrictions = ['scene'];
    return ctor;
});

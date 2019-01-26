define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.startGameScript = attributes.startGameScript || '';
        this.endRoundScript = attributes.endRoundScript || '';
        this.endGameScript = attributes.endGameScript || '';

        this.playerKey1 = attributes.playerKey1 || 1;
        this.playerKey2 = attributes.playerKey2 || 2;
        this.playerKey3 = attributes.playerKey3 || 3;
        this.playerKey4 = attributes.playerKey4 || 4;
        this.playerKey5 = attributes.playerKey5 || 5;
        this.playerKey6 = attributes.playerKey6 || 6;
    };

    ctor.type = 'nodes.playPoobah';
    ctor.displayName = 'Play Poobah';

    return ctor;
});

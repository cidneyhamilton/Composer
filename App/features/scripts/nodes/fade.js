define(function (require) {
    var selectedGame = require('features/projectSelector/index');

    var ctor = function (attributes) {
        attributes = attributes || {};

	this.advanced = selectedGame.activeProject.format == 'json';

        this.type = ctor.type;
        this.scope = attributes.scope || 'FadeOutAndIn';
        this.fadeTime = ( typeof attributes.fadeTime != 'undefined' ? attributes.fadeTime : 2);  // Used on Fade Out
        this.fadeTime2 = (typeof attributes.fadeTime2 != 'undefined' ? attributes.fadeTime2 : 2) // Used on Fade In
        this.wait = (attributes.wait == null) ? true : attributes.wait;
        this.fadeDown = (typeof attributes.fadeDown != 'undefined' ? attributes.fadeDown : 0.5);   // Time in black
        this.fadeColorR = 0;    // For future use
        this.fadeColorG = 0;
        this.fadeColorB = 0;
    };

    ctor.type = 'nodes.fade';
    ctor.displayName = 'Fade';

    return ctor;
});

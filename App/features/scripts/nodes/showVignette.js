define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.vignetteName = attributes.vignetteName || null;
        this.crossFadeTime = attributes.crossFadeTime || 0;

        this.isCrossFade = function() {
            return this.crossFadeTime > 0;
        }
    };

    ctor.type = 'nodes.showVignette';
    ctor.displayName = 'Show Vignette';

    return ctor;
});
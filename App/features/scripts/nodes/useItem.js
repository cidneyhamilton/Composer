define(function(require) {
    var system = require('durandal/system');

   var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.sceneId = attributes.sceneId || currentSceneId;
        this.propId = attributes.propId;
    };

    ctor.type = 'nodes.useItem';
    ctor.displayName = 'Use Item';

    return ctor;
});
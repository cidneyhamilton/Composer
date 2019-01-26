define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.sceneId = 'a4d66827-dd60-451f-8015-62b8abb42f0c';  // Achivements Scene
        this.propId = attributes.propId || null;
    };

    ctor.type = 'nodes.achievements';
    ctor.displayName = 'Achievements';

    return ctor;
});
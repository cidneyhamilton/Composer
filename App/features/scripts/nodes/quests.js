define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.sceneId = 'e8520824-d970-4c6e-8aec-6c308c8846ab';  // Quests Scene
        this.propId = attributes.propId || null;
        this.target = attributes.target || null;
        this.notify = (attributes.notify == null) ? true : attributes.notify;
    };

    ctor.type = 'nodes.quests';
    ctor.displayName = 'Quests';

    return ctor;
});
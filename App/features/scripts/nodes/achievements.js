define(function(require) {
    var system = require('durandal/system'),
        loadedConstants = require('features/constants/loadedConstants');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.sceneId = loadedConstants.achievementsSceneId;
        this.propId = attributes.propId || null;
    };

    ctor.type = 'nodes.achievements';
    ctor.displayName = 'Achievements';

    return ctor;
});
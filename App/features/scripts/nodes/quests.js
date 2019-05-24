define(function(require) {
    var system = require('durandal/system'),
        loadedConstants = require('features/constants/loadedConstants');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.sceneId = loadedConstants.questsSceneId;
        this.propId = attributes.propId || null;
        this.target = attributes.target || null;
        this.notify = (attributes.notify == null) ? true : attributes.notify;
    };

    ctor.type = 'nodes.quests';
    ctor.displayName = 'Quests';

    return ctor;
});
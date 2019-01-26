define(function (require) {
    var system = require('durandal/system');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.repeatEveryDay = attributes.repeatEveryDay || false;
        this.days = attributes.days || 0;
        this.hours = attributes.hours || 0;
        this.minutes = attributes.minutes || 0;
        this.scopeName = attributes.scopeName || 'ego';
        this.scopeId = attributes.scopeId;
        this.scriptId = attributes.scriptId;
        this.sceneId = attributes.sceneId;
    };

    ctor.type = 'nodes.futureScript';
    ctor.displayName = 'Future Script';

    ctor.prototype.localize = function (context) {
        delete this.sceneId;
    };

    return ctor;
});
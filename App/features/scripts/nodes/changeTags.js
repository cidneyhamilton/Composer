define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.id = attributes.id || system.guid();
        this.scope = attributes.scope || null;
        this.scopeId = attributes.scopeId || null;
        this.scopeFilterId = attributes.scopeFilterId || null;
        this.tagsToAdd = attributes.tagsToAdd;
        this.tagsToRemove = attributes.tagsToRemove || null;
    };

    ctor.type = 'nodes.changeTags';
    ctor.displayName = 'Tags';

    return ctor;
});
define(function(require) {
    var system = require('durandal/system');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.id = attributes.id || system.guid();
        this.type = ctor.type;
        this.skill = attributes.skill || '';
        this.amount = attributes.amount;
        this.notify = (attributes.notify == null) ? true : attributes.notify;

    };

    ctor.type = 'nodes.improveSkill';
    ctor.displayName = 'Improve Skill';

    return ctor;
});
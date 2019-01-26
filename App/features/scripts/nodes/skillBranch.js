define(function(require) {
    var system = require('durandal/system'),
        Block = require('./block');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.id = attributes.id || system.guid();
        this.type = ctor.type;
        this.skill = attributes.skill || '';
        this.target = attributes.target || 0;
        this.success = attributes.success || new Block();
        this.failure = attributes.failure || new Block();
        this.notify = (attributes.notify == null) ? true : attributes.notify;
    };

    ctor.type = 'nodes.skillBranch';
    ctor.displayName = 'Use Skill Branch';

    ctor.prototype.localize = function(context){
        this.success.localize(context);
        this.failure.localize(context);
    };

    return ctor;
});
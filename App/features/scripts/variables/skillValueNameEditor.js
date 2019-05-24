define(function (require) {
    var observable = require('plugins/observable'),
        loadedConstants = require('features/constants/loadedConstants');

    var ctor = function () {
    };

    ctor.prototype.activate = function (node, skillValueName) {
        this.node = node;
        this.skillValueName = skillValueName;
        this.skills = loadedConstants.constants.SkillsAndStats.skills;

        observable.defineProperty(this, 'description', function () {
            // If skillValueName is defined, return a user-friendly description for it.
            if (this.skillValueName) {
                return this.skillValueName.getDescription();
            }
            return null;
        });
    }

    return ctor;
});
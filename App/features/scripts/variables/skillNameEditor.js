define(function (require) {
    var observable = require('plugins/observable'),
        loadedConstants = require('features/constants/loadedConstants');

    var ctor = function () {
    };

    ctor.prototype.activate = function (node, skillName) {
        this.node = node;
        this.skillName = skillName;
        this.skills = loadedConstants.constants.SkillsAndStats.skills;

        observable.defineProperty(this, 'description', function () {
            // If skillName is defined, return a user-friendly description for it.
            if (this.skillName) {
                return this.skillName.getDescription();
            }
            return null;
        });
    }

    return ctor;
});
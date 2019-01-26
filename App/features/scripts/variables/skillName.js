define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.skill = attributes.skill || '';
    };

    ctor.type = 'variables.skillName';
    ctor.prototype.displayName = 'Skill Name';

    ctor.prototype.getDescription = function(){
        return "Skill: " + this.skill;
    }

    return ctor;
});
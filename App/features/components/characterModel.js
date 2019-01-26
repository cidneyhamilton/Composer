define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.reputation = attributes.reputation || 0;
        this.agility = attributes.agility || 0;
        this.charm = attributes.charm || 0;
        this.fitness = attributes.fitness || 0;
        this.magic = attributes.magic || 0;
        this.perception = attributes.perception || 0;
        this.smarts = attributes.smarts || 0;
        this.moxie = attributes.moxie || 0;
        this.luck = attributes.luck || 0;
    };

    ctor.displayName = 'Character Sheet';
    ctor.type = 'character.model';

    ctor.isCompatibleWith = function (entity) {
        return entity.type == 'actor';
    };

    return ctor;
});
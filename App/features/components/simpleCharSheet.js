define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;

		// TODO: Define this list from Composer
		this.smarts = attributes.smarts || 0;
		this.fitness = attributes.fitness || 0;
		this.moxie = attributes.moxie || 0;
        this.charm = attributes.charm || 0;
		this.skills = attributes.skills || 0;
        this.luck = attributes.luck || 0;
    };

    ctor.displayName = 'Simple Character Sheet';
    ctor.type = 'character.simpleModel';

    ctor.isCompatibleWith = function (entity) {
        return entity.type == 'actor';
    };

    return ctor;
});

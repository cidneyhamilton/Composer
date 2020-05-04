define(function (require) {
    var Literal = require('../variables/literal'),
        loadedConstants = require('features/constants/loadedConstants');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || '';
        this.scope = attributes.scope || 'script';
        this.scopeId = attributes.scopeId;
        this.sceneId = attributes.sceneId || loadedConstants.inventorySceneId;
        this.source = attributes.source || new Literal();
		this.add = !!attributes.add;
    };

    ctor.type = 'nodes.setVariable';
    ctor.displayName = 'Variable';

    ctor.prototype.localize = function (localizationId, context) {
        if(this.source.localize) {
            this.source.localize(localizationId + "_setVariable", context);
        }

        delete this.sceneId;
    };

    return ctor;
});

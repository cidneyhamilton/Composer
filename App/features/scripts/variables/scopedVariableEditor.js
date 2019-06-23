define(function (require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable');

    var props = assetDatabase.props.entries;
	
    var ctor = function () {
    };

    ctor.prototype.activate = function (node, scopedVariable) {
        this.node = node;
        this.scopedVariable = scopedVariable;

        this.scopes = ['script', 'target', 'scene', 'event', 'ego', 'prop'];
        this.scenes = assetDatabase.scenes.entries;
		
        observable.defineProperty(this, 'propstring', function () {

            var scope = scopedVariable.scope;
            var sceneId = scopedVariable.sceneId;
            var propId = scopedVariable.scopeId;
            var desc = '';

            if (scope == 'prop') {
                if (propId == null) {
                    desc += " on Undefined";
                } 
                else 
                {
                    var prop = assetDatabase.props.lookup[propId];

                    desc += " on (" + (prop ? prop.name : propId) + ")";

                    if (sceneId == null) 
                    {
                        desc += " in Undefined"
                    } 
                    else 
                    {
                        var scene = assetDatabase.scenes.lookup[sceneId];

                        desc += " in (" + (scene ? scene.name : sceneId) + ")";
                        
                    }
                }
            }

            return desc;
        });

        observable.defineProperty(this, 'props', function () {
            var sceneId = scopedVariable.sceneId;
            return props.filter(function (item) {
                return item.sceneId == sceneId;
            });
        });
		
        observable.defineProperty(this, 'description', function () {
            // If scopedVariable is defined, return a user-friendly description for it.
            if (this.scopedVariable) {
                return this.scopedVariable.getDescription();
            }
            return null;
        });
    }

    return ctor;
});
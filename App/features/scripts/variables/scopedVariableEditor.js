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
                    var results = assetDatabase.props.entries.filter(function(item){
                        return item.id == propId;
                    });

                    desc += " on (" + results[0].name + ")";

                    if (sceneId == null) 
                    {
                        desc += " in Undefined"
                    } 
                    else 
                    {
                        var results = assetDatabase.scenes.entries.filter(function(item){
                            return item.id == sceneId;
                        });

                        desc += " in (" + results[0].name + ")";
                        
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
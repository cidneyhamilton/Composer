define(function (require) {
    var NodeEditor = require('./nodeEditor'),
        observable = require('plugins/observable'),
        assetDatabase = require('infrastructure/assetDatabase'),
        variableRegistry = require('../variables/registry'),
        selectedGame = require('features/projectSelector/index');

    var props = assetDatabase.props.entries;

    var ctor = function () {
        var that = this;

        NodeEditor.call(this);

        this.showAdvanced = selectedGame.showAdvanced;

        if (selectedGame.showAdvanced) {
            this.scopes = ['script', 'target', 'scene', 'event', 'ego', 'prop'];
        } else {
            this.scopes = ['ego'];
        }

        this.scenes = assetDatabase.scenes.entries;

        observable.defineProperty(this, 'propstring', function () {

            var scope = that.node.scope;
            var sceneId = that.node.sceneId;
            var propId = that.node.scopeId;
            var desc = '';

            if (scope == 'prop') {
                if (propId == null) {
                    desc += " on Undefined";
                } else {
                    var prop = assetDatabase.props.lookup[propId];

                    desc += " on (" + prop ? prop.name : propId + ")";

                    if (sceneId == null) {
                        desc += " in Undefined"
                    } else {
                        var scene = assetDatabase.scenes.lookup[sceneId];
                        desc += " in (" + scene ? scene.name : sceneId + ")";                        
                    }
                }
            }

            return desc;
        });

        observable.defineProperty(this, 'props', function () {
            var sceneId = this.node.sceneId;
            return props.filter(function (item) {
                return item.sceneId == sceneId;
            });
        });

        observable.defineProperty(this, 'sources', function () {
            var sources = [];
            var nodeSource = that.node.source;
            
            var variables = variableRegistry.baseSources;
            if (selectedGame.showAdvanced) {
                variables = variableRegistry.addableSources;
            }
            variables.forEach(function(source) {
                if (source.type == nodeSource.type) {
                    sources.push(nodeSource);
                } else {
                    sources.push(new source());
                }
            });

            return sources;
        });
    };

    NodeEditor.baseOn(ctor);

    return ctor;
});

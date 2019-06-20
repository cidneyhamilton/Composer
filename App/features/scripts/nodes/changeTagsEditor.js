define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        Editor = require('features/shared/editor'),
        selectedGame = require('features/projectSelector/index');

    var ctor = function() {
        NodeEditor.call(this);

        this.actors = assetDatabase.actors.entries;
        this.props = assetDatabase.props.entries;
        this.scenes = assetDatabase.scenes.entries;
        this.storyEvents = assetDatabase.storyEvents.entries;
        this.showAdvanced = selectedGame.showAdvanced;

        // All scenes with at least one prop
        this.scenesWithProps = assetDatabase.scenes.entries.filter(function(item){
            return assetDatabase.props.entries.some(function(item2) {
                return item2.sceneId == item.id;
            });
        });

        observable.defineProperty(this, 'scopedProps', function(){
            var that = this;
            var scopeFilterId = that.node.scopeFilterId;

            var results = that.props.filter(function(item){
                return item.sceneId == scopeFilterId;
            });

            return results;
        });

        observable.defineProperty(this, 'entity', function(){
            var that = this, results, items;

            switch(this.node.scope){
                case 'actor':
                    items = that.actors;
                    break;
                case 'prop':
                    items = that.props;
                    break;
                case 'scene':
                    items = that.scenes;
                    break;
                case 'storyEvent':
                    items = that.storyEvents;
                    break;
                default:
                    items = [];
                    break;
            }

            results = items.filter(function(item){
                return item.id == that.node.scopeId;
            });

            if (this.node.scope == "target") {
                return  { name: this.node.scope = 'target' };
            }

            return results[0] || { name: this.node.scope == 'script' ? 'script' : '???' };
        });
    };

    NodeEditor.baseOn(ctor);

    ctor.prototype.setDefaultScopeValues = function(data, event){
        var that = this;

        // For some reason, currentSceneId is undefined, but Editor.currentSceneId is fine.
        // Unfortunately, Editor doesn't include the other two values.
        // I have no idea how this stuff is set.

        switch (data.node.scope) {
            case 'actor':
                if (currentActorId) {
                    data.node.scopeId = currentActorId;
                }
                break;
            case 'prop':
                if (Editor.currentSceneId) {
                    data.node.scopeFilterId = Editor.currentSceneId;
                }
                if (currentPropId) {
                    data.node.scopeId = currentPropId;
                }
                break;
            case 'scene':
                if (Editor.currentSceneId) {
                    data.node.scopeId = Editor.currentSceneId;
                }
                break;
        }
    };

    return ctor;
});
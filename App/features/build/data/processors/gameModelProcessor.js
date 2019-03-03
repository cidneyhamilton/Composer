define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'),
        path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system');

    var ctor = function () {
        baseProcessor.call(this);
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.init = function() {
        this.gameModel = {
            entityModels:[],
            scriptIndex:[]
        };
    };

    ctor.prototype.parseAsset = function(context, asset, friendlyIdOverride, deleteSceneId) {
        var clone = serializer.deserialize(serializer.serialize(asset));
        clone.friendlyId = (friendlyIdOverride ? friendlyIdOverride : clone.name);
        delete clone.notes;
        if (deleteSceneId) {
            delete clone.sceneId;
        }
        this.gameModel.entityModels.push(clone);
    };

    ctor.prototype.parseScene = function(context, idMap, scene) {
        this.parseAsset(context, scene);
    };

    ctor.prototype.parseActor = function(context, idMap, actor) {
        this.parseAsset(context, actor);
    };
    
    ctor.prototype.parseStoryEvent = function(context, idMap, storyEvent) {
        this.parseAsset(context, storyEvent);
    };
    
    ctor.prototype.parseProp = function(context, idMap, prop) {
        var friendlyIdOverride;
        if (prop.sceneId && null != prop.sceneId && '' != prop.sceneId) {
            friendlyIdOverride = idMap[prop.sceneId];
        } else {
            friendlyIdOverride =  'undefined';
        }
        friendlyIdOverride +=  '/' + prop.name;
        this.parseAsset(context, prop, friendlyIdOverride, true);
    };

    ctor.prototype.finish = function(context) {
        this.gameModel.scriptIndex = serializer.deserialize(serializer.serialize(db.scripts.entries));
        var output = serializer.serialize(this.gameModel, context.getJsonSpacing());
        var fileName = path.join(context.dataOutputDirectory, 'model.txt');

        fileSystem.write(fileName, output);
    };

    return new ctor();
});
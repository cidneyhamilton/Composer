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

    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {
        var clone = serializer.deserialize(serializer.serialize(script));

        //clone.localize(context);

        delete clone.storyEventId;
        delete clone.sceneId;
        delete clone.propId;
        delete clone.actorId;
        delete clone.trigger.name;

        var outputDirectory = path.join(context.dataOutputDirectory, 'scripts');
        fileSystem.makeDirectory(outputDirectory);

        var output = serializer.serialize(clone, context.getJsonSpacing()); 
        var fileName = path.join(outputDirectory, script.id + ".txt");

        fileSystem.write(fileName, output);
    };

    ctor.prototype.finish = function(context, idMap) {
        // Clean up non-generated files
        var outputDirectory = path.join(context.dataOutputDirectory, 'scripts');
        fileSystem.makeDirectory(outputDirectory);
        var filesInDir = fileSystem.readDir(outputDirectory);
        for(var fileCounter = 0; fileCounter < filesInDir.length; fileCounter++) {
            var fileName = filesInDir[fileCounter];
            var scriptId = fileName.split(".")[0];
            if (!db.scripts.lookup[scriptId]) {
                fileSystem.remove(fileName);
            }
        }

        baseProcessor.prototype.finish.call(this, context);
    };

    return new ctor();
});
define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'), 
        path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system'),
        ink = require('features/build/data/inkConvert');

    var ctor = function () {
        baseProcessor.call(this);
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {
        var outputDirectory = path.join(context.dataOutputDirectory, 'scripts');
        fileSystem.makeDirectory(outputDirectory);

        var output = ink.convertScript(script);
        var fileName = path.join(outputDirectory, script.id + ".ink");
        fileSystem.write(fileName, output);
    };

    ctor.prototype.finish = function(context, idMap) {
        baseProcessor.prototype.finish.call(this, context);
    };

    return new ctor();
});
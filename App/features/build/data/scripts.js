define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system');

    function processEntry(context, entry, outputDirectory){
        entry.open();
        var clone = serializer.deserialize(serializer.serialize(entry.item));

        clone.localize(context);

        delete clone.storyEventId;
        delete clone.sceneId;
        delete clone.propId;
        delete clone.actorId;
        delete clone.trigger.name;

        var output = serializer.serialize(clone, context.getJsonSpacing());
        var fileName = path.join(outputDirectory, entry.id + '.txt');

        fileSystem.write(fileName, output);
        entry.close();
    }

    return {
        run:function(context){
            context.indicator.message = 'Building script data...';

            return system.defer(function(dfd){
                var i = -1;
                var len = db.scripts.entries.length;
                var outputDirectory = path.join(context.dataOutputDirectory, 'scripts');
                var current;

                if (!fileSystem.exists(outputDirectory)) {
                    fileSystem.makeDirectory(outputDirectory);
                }

                // We'll create a list of all files currently in the unity dir.
                // This is so we can weed out all of the stale scripts that were deleted in Composer.
                // Painful, but clearing the entire directory would mess up the .meta files :(
                var filesInDir = fileSystem.readDir(outputDirectory);
                var staleScripts = [];
                for(var fileCounter = 0; fileCounter < filesInDir.length; fileCounter++) {
                    staleScripts.push(filesInDir[fileCounter]);
                }

                function next(){
                    i++;

                    if(i < len){
                        current = db.scripts.entries[i];
                        processEntry(context, current, outputDirectory);

                        // If this was an existing file, remove it from the staleScripts list
                        var fileIndex = staleScripts.indexOf(current.id + '.txt');
                        if (fileIndex > -1) {
                            staleScripts.splice(fileIndex, 1);
                            // Also remove its associated .meta file, if any
                            fileIndex = staleScripts.indexOf(current.id + '.txt.meta');
                            if (fileIndex > -1) {
                                staleScripts.splice(fileIndex, 1);
                            }
                        }

                        next();
                    }else{
                        context.gameModel.scriptIndex = serializer.deserialize(serializer.serialize(db.scripts.entries));
                        // If there are any stale scripts that were deleted in Composer, clean them up from Unity.
                        for (var staleCounter = 0; staleCounter < staleScripts.length; staleCounter++) {
                            var fileName = path.join(outputDirectory, staleScripts[staleCounter]);
                            fileSystem.remove(fileName);
                        }
                        context.completed.push('features/build/data/scripts');
                        dfd.resolve();
                    }
                }


                next();
            }).promise();
        }
    };
});
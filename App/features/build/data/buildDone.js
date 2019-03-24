define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        system = require('durandal/system'),
        fileWriteTracker = require('infrastructure/fileWriteTracker');

    return {
        run:function(context) {

            return system.defer(function(dfd) {

                function next(){
                    if(!fileWriteTracker.hasWrites()){
                        var endTime = new Date();
                    	fileSystem.write(context.doneFile, 'Build started at: ' + context.startTime.toLocaleString() + '\nBuild completed at: ' + endTime.toLocaleString());
                        console.log("Build completed in " +  ((endTime.getTime() - context.startTime.getTime()) / 1000) + " seconds");
                        dfd.resolve();
                    } else {
                        var currTime = new Date();
                        context.indicator.message = fileWriteTracker.numWritesRemaining() + " more file(s) to write (" + ((currTime.getTime() - context.startTime.getTime()) / 1000) + "s elapsed)";
                    	setTimeout(function() { next(); }, 50);
                    }
                }

                next();
            }).promise();
        }
    };
});
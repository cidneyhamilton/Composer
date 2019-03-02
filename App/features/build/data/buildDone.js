define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        system = require('durandal/system');

    return {
        run:function(context, numExpected) {

            return system.defer(function(dfd) {

                function next(){
                    if(context.completed.length == numExpected){
                        var endTime = new Date();
                    	fileSystem.write(context.doneFile, 'Build started at: ' + context.startTime.toLocaleString() + '\nBuild completed at: ' + endTime.toLocaleString());
                        console.log("Build completed in " +  ((endTime.getTime() - context.startTime.getTime()) / 1000) + " seconds");
                        dfd.resolve();
                    } else {
                        var currTime = new Date();
                        context.indicator.message = "Building (" + ((currTime.getTime() - context.startTime.getTime()) / 1000) + " seconds elapsed)";
                    	setTimeout(function() { next(); }, 50);
                    }
                }

                next();
            }).promise();
        }
    };
});
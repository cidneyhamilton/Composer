define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        system = require('durandal/system');

    return {
        run:function(context, numExpected) {

            return system.defer(function(dfd) {

                function next(){
                    if(context.completed.length == numExpected){
                    	fileSystem.write(context.doneFile, 'Build started at: ' + context.startTime + '\nBuild completed at: ' + new Date().toLocaleString());
                        dfd.resolve();
                    } else {
                    	setTimeout(function() { next(); }, 50);
                    }
                }

                next();
            }).promise();
        }
    };
});
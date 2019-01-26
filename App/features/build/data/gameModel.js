define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system');

    return {
        run:function(context){
            context.indicator.message = 'Writing out game model...';

            var output = serializer.serialize(context.gameModel, context.getJsonSpacing());
            var fileName = path.join(context.dataOutputDirectory, 'model.txt');

            fileSystem.write(fileName, output);
            context.completed.push('features/build/data/gameModel');
        }
    };
});
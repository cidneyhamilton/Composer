define(function(require){
    var serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system');

    function getSceneName(entry){
        var scenes = db.scenes.entries;
        var sceneId = entry.sceneId;

        for(var i = 0, length = scenes.length; i < length; i++){
            var current = scenes[i];

            if(current.id == sceneId){
                return current.name;
            }
        }
    }

    function processEntry(entry, context){
        entry.open();
        var clone = serializer.deserialize(serializer.serialize(entry.item));
        clone.friendlyId = getSceneName(clone) + '/' + clone.name;
        clone.localize(context);
        delete clone.notes;
        delete clone.sceneId;
        context.gameModel.entityModels.push(clone);
        entry.close();
    }

    return {
        run:function(context){
            context.indicator.message = 'Building prop data...';

            return system.defer(function(dfd){
                var i = -1;
                var len = db.props.entries.length;
                var current;

                function next(){
                    i++;

                    if(i < len){
                        current = db.props.entries[i];
                        processEntry(current, context);
                        next();
                    }else{
                        context.completed.push('features/build/data/props');
                        dfd.resolve();
                    }
                }

                next();
            }).promise();
        }
    };
});
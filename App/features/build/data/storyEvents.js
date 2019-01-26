define(function(require){
    var serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system');

    function processEntry(entry, context){
        entry.open();
        var clone = serializer.deserialize(serializer.serialize(entry.item));
        clone.friendlyId = clone.name;
        clone.localize(context);
        delete clone.notes;
        context.gameModel.entityModels.push(clone);
        entry.close();
    }

    return {
        run:function(context){
            context.indicator.message = 'Building story event data...';

            return system.defer(function(dfd){
                var i = -1;
                var len = db.storyEvents.entries.length;
                var current;

                function next(){
                    i++;

                    if(i < len){
                        current = db.storyEvents.entries[i];
                        processEntry(current, context);
                        next();
                    }else{
                        context.completed.push('features/build/data/storyEvents');
                        dfd.resolve();
                    }
                }

                next();
            }).promise();
        }
    };
});
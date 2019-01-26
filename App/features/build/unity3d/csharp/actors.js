define(function(require){
    var generateRegistry = require('./generateRegistry'),
        actorDrawerTemplate = require('text!./actorDrawerTemplate.txt'),
        path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        db = require('infrastructure/assetDatabase');

    return {
        run:function(context){
            generateRegistry(context, 'actors', 'Actor', 'Actors.cs');
            var entries = db.actors.entries;
            var listItems = '';
            var absoluteCodePath = path.join(context.editorOutputDirectory, 'ActorDrawer.cs');

            entries.forEach(function(item){
                listItems += '\n            new Item("' + item.id + '", "' + item.name + '"),'
            });

            var output = actorDrawerTemplate.replace('{list items}', listItems.slice(0, - 1));

            fileSystem.write(absoluteCodePath, output);

            context.completed.push('features/build/unity3d/csharp/actors');
        }
    };
});
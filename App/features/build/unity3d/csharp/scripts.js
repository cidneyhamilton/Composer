define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        db = require('infrastructure/assetDatabase'),
        scriptDrawerTemplate = require('text!./scriptDrawerTemplate.txt');

    return {
        run:function(context){
            var sceneLookup = db.scenes.lookup;
            var scripts = db.scripts.entries;
            var absoluteEditorPath = path.join(context.editorOutputDirectory, 'ScriptDrawer.cs');
            var code = '';
            var entries = [];
            var entryLookup = {};

            scripts.forEach(function(item){
                if(!item.sceneId || item.triggerType != 'triggers.zone'){
                    return;
                }

                var found = entryLookup[item.sceneId];
                if(!found){
                    found = {
                        id: item.sceneId,
                        name: sceneLookup[item.sceneId].name,
                        scripts:[]
                    };

                    entries.push(found);
                    entryLookup[item.sceneId] = found;
                }

                found.scripts.push(item);
            });

            entries.forEach(function(item){
                code += '\n            new Item("' + item.name + '") { \n                Children = new List<Item.ChildItem> {';

                item.scripts.forEach(function(script){
                    code += '\n                    new Item.ChildItem("' + script.id +'", "' + script.name +'"),';
                });

                code += '\n                }\n            },';
            });

            var output = scriptDrawerTemplate.replace('{list items}', code);
            fileSystem.write(absoluteEditorPath, output);
            context.completed.push('features/build/unity3d/csharp/scripts');
        }
    };
});

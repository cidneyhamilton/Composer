define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        db = require('infrastructure/assetDatabase'),
        propDrawerTemplate = require('text!./propDrawerTemplate.txt');

    return {
        run:function(context){
            var entries = db.scenes.entries;
            var absoluteEditorPath = path.join(context.editorOutputDirectory, 'PropDrawer.cs');
            var code = '';

            entries.forEach(function(item){
                code += '\n            new Item("' + item.name + '") { \n                Children = new List<Item.ChildItem> {';

                db.props.entries.forEach(function(prop){
                    if(prop.sceneId == item.id){
                        code += '\n                    new Item.ChildItem("' + prop.id +'", "' + prop.name +'"),';
                    }
                });

                code += '\n                }\n            },';
            });

            var output = propDrawerTemplate.replace('{list items}', code);
            fileSystem.write(absoluteEditorPath, output);
            context.completed.push('features/build/unity3d/csharp/scenes');
        }
    };
});

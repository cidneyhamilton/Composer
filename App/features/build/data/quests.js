define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system'),
        template = require('text!./questsTemplate.txt'),
        selectedGame = require('features/projectSelector/index');
    return {
        run:function(context){
            var outputDirectory = path.join(selectedGame.activeProject.dir, "../Game/Assets/CodeGen/");
            var fileName = path.join(outputDirectory, 'Quests.cs'); 

            context.indicator.message = 'Writing Quests';

            var output = "nothing"; 
            
            var tasksSceneId = 'e8520824-d970-4c6e-8aec-6c308c8846ab';
            var props = db.props;
            
            var output = "";
            var lineItemString = '            {new Guid("{id}"), new Quest(new Guid("{id}"), "{name}", {value} ) },'
            var achievementCount = 0;
            for(var i=0;i<db.props.entries.length;i++) {
                var prop = db.props.entries[i];
                if (prop.sceneId == tasksSceneId) {
                    // console.log(prop);
                    output += lineItemString.replace('{id}', prop.id).replace('{id}', prop.id).replace('{name}', (!!prop.displayName) ? prop.displayName : prop.name).replace('{value}', prop.value || 0);
                    output += "\r\n";
                    achievementCount++;
                }
            }

            console.log("Quest Count: " + achievementCount);
            var finalOutput = template.replace("/*{{ListItems}}*/", output);

            // Actually Write the file
            fileSystem.makeDirectory(outputDirectory);
            fileSystem.write(fileName, finalOutput);

            context.completed.push('features/build/data/quests');
        }
    };
});
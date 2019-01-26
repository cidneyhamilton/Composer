define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system'),
        template = require('text!./achievementsTemplate.txt');
    return {
        run:function(context){
            var outputDirectory = "../Game/Assets/CodeGen/";
            var fileName = path.join(outputDirectory, 'Achievements.cs'); 

            context.indicator.message = 'Writing Achievements';

            var output = "nothing"; 
            
            var achievmentsSceneId = 'a4d66827-dd60-451f-8015-62b8abb42f0c';
            var props = db.props;
            
            var output = "";
            var lineItemString = '            {new Guid("{id}"), new Achievement(new Guid("{id}")) },'
            var achievementCount = 0;
            for(var i=0;i<db.props.entries.length;i++) {
                var prop = db.props.entries[i];
                if (prop.sceneId == achievmentsSceneId) {
                    output += lineItemString.replace('{id}', prop.id).replace('{id}', prop.id);
                    output += "\r\n";
                    achievementCount++;
                }
            }

            console.log("Achievement Count: " + achievementCount);
            var finalOutput = template.replace("{{ListItems}}", output);

            // Actually Write the file
            fileSystem.makeDirectory(outputDirectory);
            fileSystem.write(fileName, finalOutput);
            context.completed.push('features/build/data/Achievements');
        }
    };
});
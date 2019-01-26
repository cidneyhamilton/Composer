define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        system = require('durandal/system'),
        db = require('infrastructure/assetDatabase'),
        localizationGroupTemplate = require('text!./localizationGroupTemplate.txt'),
        nonLocalizedNamesTemplate = require('text!./nonLocalizedNamesTemplate.txt');

    function processEntry(entry, context, code){
        entry.open();
        var group = entry.item;

        code.push('\n        public static class ' + group.name + ' { ');
        group.entries.forEach(function(locEntry) {
           	code.push('\n            public static readonly string ' + locEntry.id +' = "' + locEntry.id +'";');
        });
        code.push('\n        }\n');
        entry.close();
    }

    return {
        run:function(context) {
            return system.defer(function(dfd){
                var i = -1;
                var len = db.localizationGroups.entries.length;
                var current;
                var code = [];

                // Generate the nonLocalizednNames dictionary
                function generateNonLocalizedNameDrawer() {
                    var absoluteEditorPath = path.join(context.codeOutputDirectory, 'NonLocalizedNames.cs');
                    var codesToGet = ['actors', 'props', 'scenes', 'storyEvents']
                    var output = nonLocalizedNamesTemplate;

                    codesToGet.forEach(function(entityType) {
                        var nonLocalizedCode = '';
                        // Sort by name, displayName, GUID to make the order more consistent across runs
                        var orderedEntries = db[entityType].entries.sort(function(a, b) {
                            var nameDiff = a.name.localeCompare(b.name);
                            var displayNameDiff = a.displayName.localeCompare(b.displayName);
                            var guidDiff = a.id.localeCompare(b.id); 
                            return (nameDiff != 0 ? nameDiff : (displayNameDiff != 0 ? displayNameDiff : guidDiff) );
                        });

                        orderedEntries.forEach(function(item){
                            var name = item.name.replace(/"/g, '\\"');
                            var displayName = item.displayName.replace(/"/g, '\\"');
                            nonLocalizedCode += '\n            {"' + item.id + '", new KeyValuePair<string, string> ("' + name + '", "' + displayName + '") },';
                        });

                        output = output.replace('{' + entityType + '}', nonLocalizedCode); 
                    });

                    fileSystem.write(absoluteEditorPath, output);
                }

                function next(){
                    i++;

                    if(i < len){
                        current = db.localizationGroups.entries[i];
                        processEntry(current, context, code);
                        next();
                    }else{
            			var absoluteEditorPath = path.join(context.codeOutputDirectory, 'LocalizationGroups.cs');

			            var output = localizationGroupTemplate.replace('{localizationGroups}', code.join(''));
			            fileSystem.write(absoluteEditorPath, output);
			            context.completed.push('features/build/unity3d/csharp/localizationGroups');
                        dfd.resolve();
                    }
                }

                generateNonLocalizedNameDrawer();
                next();
            }).promise();
        }
    };
});

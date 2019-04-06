define(function(require) {
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        selectedGame = require('features/projectSelector/index');

    var buildConfig = {
        activate:function(){
            var that = this;
            that.project = {
                build:{
                    targetPlatform:'unity3d',
                    targetLanguage:'csharp',
                    dataOutputDirectory: "../Game/Assets/Resources/Composer",
                    codeOutputDirectory: "../Game/Assets/Scripts/Composer",
                    codeGenOutputDirectory: "../Game/Assets/CodeGen",
                    editorOutputDirectory: "../Game/Assets/Scripts/Editor",
                    localizationOutputDirectory: "../Game/Assets/Resources/Locales",
                    translationOutputDirectory: "../Translations",
                    internalDocOutputDirectory: "../Proofread",
                    inkOutputDirectory: "../SummerDaze/Assets/Ink"
                }
            };

            // Ensure the Composer/Data directory exists
            var projectPathDir =  path.join(selectedGame.activeProject.dir, '/Data');
            fileSystem.makeDirectory(projectPathDir);
            var projectPath = path.join(projectPathDir, 'project.json');

            if(fileSystem.exists(projectPath)) {
                var data = fileSystem.read(projectPath);
                var rawJsonText = String(data);
                var loadedProject = serializer.deserialize(rawJsonText);

                // We'll override the defaults with the loaded options (this allows people with existing configs to pick up any new attributes)
                for (var projectBuild in that.project) {
                    for (var projectBuildKey in that.project[projectBuild]) {
                        if (loadedProject[projectBuild][projectBuildKey]) {
                            that.project[projectBuild][projectBuildKey] = loadedProject[projectBuild][projectBuildKey];
                        }
                    }
                }
            }

            // Ensure all of the directories exist
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.dataOutputDirectory));
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.codeOutputDirectory));
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.codeGenOutputDirectory));
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.editorOutputDirectory));
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.localizationOutputDirectory));
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.translationOutputDirectory));
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.internalDocOutputDirectory));
            // Only verify the ink dir for ink projects
            if (selectedGame.activeProject.format == 'ink') {
                fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.inkOutputDirectory));
            }
        }
    };

    return buildConfig;
});
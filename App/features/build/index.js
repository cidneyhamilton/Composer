define(function(require) {
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        commonDialogs = require('infrastructure/commonDialogs'),
        runner = require('./runner'),
        selectedGame = require('features/projectSelector/index');

    // Ensure the Composer/Data directory exists
    var projectPathDir =  path.join(selectedGame.activeProject.dir, '/Data');
    fileSystem.makeDirectory(projectPathDir);
    var projectPath = path.join(projectPathDir, 'project.json');

    var index = {
        save:function(){
            var json = serializer.serialize(this.project, 4);
            fileSystem.write(projectPath, json);
        },
        // This is the build button.
        build:function(){
            var that = this;
            fileSystem.write(projectPath, serializer.serialize(that.project, 4));
            runner.run(this.project, this.mode);
        },
        mode:'debug',
        chooseDataOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.dataOutputDirectory = path.relative(selectedGame.activeProject.dir, result);
                    fileSystem.write(projectPath, serializer.serialize(that.project, 4));
                }
            });
        },
        chooseCodeOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.codeOutputDirectory = path.relative(selectedGame.activeProject.dir, result);
                    fileSystem.write(projectPath, serializer.serialize(that.project, 4));
                }
            });
        },
        chooseEditorOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.editorOutputDirectory = path.relative(selectedGame.activeProject.dir, result);
                    fileSystem.write(projectPath, serializer.serialize(that.project, 4));
                }
            });
        },
        chooseLocalizationOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.localizationOutputDirectory = path.relative(selectedGame.activeProject.dir, result);
                    fileSystem.write(projectPath, serializer.serialize(that.project, 4));
                }
            });
        },
        chooseTranslationOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.translationOutputDirectory = path.relative(selectedGame.activeProject.dir, result);
                    fileSystem.write(projectPath, serializer.serialize(that.project, 4));
                }
            });
        },
        chooseInternalDocOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.internalDocOutputDirectory = path.relative(selectedGame.activeProject.dir, result);
                    fileSystem.write(projectPath, serializer.serialize(that.project, 4));
                }
            });
        },
        activate:function(){
            var that = this;
            if(fileSystem.exists(projectPath)) {
                var data = fileSystem.read(projectPath);
                var rawJsonText = String(data);
                that.project = serializer.deserialize(rawJsonText);
            } else {
               that.project = {
                   build:{
                        targetPlatform:'unity3d',
                        targetLanguage:'csharp',
                        dataOutputDirectory: "../Game/Assets/Resources/Composer",
                        codeOutputDirectory: "../Game/Assets/Scripts/Composer",
                        editorOutputDirectory: "../Game/Assets/Scripts/Editor",
                        localizationOutputDirectory: "../Game/Assets/Resources/Locales",
                        translationOutputDirectory: "../Translations",
                        internalDocOutputDirectory: "../Proofread"
                   }
               };
            }

            // Ensure all of the directories exist
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.dataOutputDirectory));
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.codeOutputDirectory));
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.editorOutputDirectory));
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.localizationOutputDirectory));
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.translationOutputDirectory));
            fileSystem.makeDirectory(path.resolve(selectedGame.activeProject.dir, that.project.build.internalDocOutputDirectory));
        }
    };

    return index;
});
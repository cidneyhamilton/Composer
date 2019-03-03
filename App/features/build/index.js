define(function(require) {
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        commonDialogs = require('infrastructure/commonDialogs'),
        runner = require('./runner'),
        selectedGame = require('features/projectSelector/index').
        buildConfig = require('features/build/buildConfig');

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
        chooseCodeGenOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.codeGenOutputDirectory = path.relative(selectedGame.activeProject.dir, result);
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
            buildConfig.activate();
            that.project = buildConfig.project;
        }
    };

    return index;
});
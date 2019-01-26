define(function(require) {
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        commonDialogs = require('infrastructure/commonDialogs'),
        runner = require('./runner');

    var dataDirectory = path.join(process.cwd(), 'Data');
    var projectPath = path.join(dataDirectory, 'project.json');

    var index = {
        save:function(){
            var json = serializer.serialize(this.project, 4);
            fileSystem.write(projectPath, json);
        },
        // This is the build button.
        build:function(){
            runner.run(this.project, this.mode);
        },
        mode:'debug',
        chooseDataOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.dataOutputDirectory = path.relative(process.cwd(), result);
                    fileSystem.write(projectPath, serializer.serialize(that.project, 4));
                }
            });
        },
        chooseCodeOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.codeOutputDirectory = path.relative(process.cwd(), result);
                    fileSystem.write(projectPath, serializer.serialize(that.project, 4));
                }
            });
        },
        chooseEditorOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.editorOutputDirectory = path.relative(process.cwd(), result);
                    fileSystem.write(projectPath, serializer.serialize(that.project, 4));
                }
            });
        },
        chooseLocalizationOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.localizationOutputDirectory = path.relative(process.cwd(), result);
                    fileSystem.write(projectPath, serializer.serialize(that.project, 4));
                }
            });
        },
        chooseTranslationOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.translationOutputDirectory = path.relative(process.cwd(), result);
                    fileSystem.write(projectPath, serializer.serialize(that.project, 4));
                }
            });
        },
        chooseInternalDocOutputDirectory:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.project.build.internalDocOutputDirectory = path.relative(process.cwd(), result);
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
                       dataOutputDirectory:'',
                       codeOutputDirectory:'',
                       editorOutputDirectory:'',
                       localizationOutputDirectory:'',
                       internalDocOutputDirectory:''
                   }
               };
            }
        }
    };

    return index;
});
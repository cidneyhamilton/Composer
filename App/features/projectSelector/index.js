define(function(require) {
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        commonDialogs = require('infrastructure/commonDialogs'),
        app = require('durandal/app'),
        ko = require('knockout');

    var projectPath = path.join(process.cwd(), 'Data/projectSelector.json');

    var index = {
        load: function(selectedProject) {
            var that = this;
            that.activeProject = ko.toJS(selectedProject);
            app.trigger('app:navigate:loadProject', that.activeProject);
        },
        save:function(){
            var json = serializer.serialize(this.project, 4);
            fileSystem.write(projectPath, json);
        },
        chooseHeroUDir:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.projects.heroU.dir = path.relative(process.cwd(), result);
                    fileSystem.write(projectPath, serializer.serialize(that.projects, 4));
                }
            });
        },
        chooseSummerDazeDir:function(){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.projects.summerDaze.dir = path.relative(process.cwd(), result);
                    fileSystem.write(projectPath, serializer.serialize(that.projects, 4));
                }
            });
        },
        activate:function(){
            var that = this;
            if(fileSystem.exists(projectPath)) {
                var data = fileSystem.read(projectPath);
                var rawJsonText = String(data);
                that.projects = serializer.deserialize(rawJsonText);
            } else {
               that.projects = {
               		heroU : {
                        gameName: 'Hero-U',
               			dir: '../Hero-U/Composer',
               			format: 'json'
               		},
               		summerDaze: {
                        gameName: 'Summer Daze',
               			dir: '',
               			format: 'ink'
               		}
               };
            }
        }
    };

    return index;
});
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
            if(fileSystem.exists(projectPath)) {
                var data = fileSystem.read(projectPath);
                var rawJsonText = String(data);
                var loadedProjects = serializer.deserialize(rawJsonText);

                // We'll override our local things with the loaded options (this allows people with existing configs to pick up any configs added for new games)
                for (var loadedGame in loadedProjects) {
                    // If we don't recognize this game, preserve it (don't delete user data!)
                    if (! that.projects[loadedGame]) {
                        // For everything else, just copy over the name, dir, and format.
                        that.projects[loadedGame] = {};
                        that.projects[loadedGame].gameName = loadedProjects[loadedGame].gameName;
                        that.projects[loadedGame].format = loadedProjects[loadedGame].format;
                    }
                    //... We always want to pick up any directories, since that's the only thing people can override in the UI.
                    that.projects[loadedGame].dir = loadedProjects[loadedGame].dir;
                }
            } 
        }
    };

    return index;
});
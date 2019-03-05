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
            that.activeProject = that.projects[selectedProject];
            app.trigger('app:navigate:loadProject', that.activeProject);
        },
        chooseDir:function(selectedProject){
            var that = this;
            commonDialogs.chooseDirectory().then(function(result){
                if(result){
                    that.projects[selectedProject].dir = path.relative(process.cwd(), result);
                    fileSystem.write(projectPath, serializer.serialize(that.projects, 4));
                }
            });
        },
        activate:function(){
            var that = this;
            that.projects = {
                heroU : {
                    gameName: 'Hero-U: Rogue to Redemption',
                    gameInternalName: "heroU",
                    dir: '../Hero-U/Composer',
                    format: 'json'
                },
                summerDaze: {
                    gameName: 'Summer Daze',
                    gameInternalName: 'summerDaze',
                    dir: '',
                    format: 'ink'
                },
                r2rdemo : {
                    gameName: 'Demo: R2R',
                    gameInternalName: 'r2rdemo',
                    dir: '',
                    format: 'json'
                },
                wizardsway : {
                    gameName: 'Hero-U: Wizards Way',
                    gameInternalName: 'wizardsway',
                    dir: '',
                    format: 'json'
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
                        that.projects[loadedGame] = {};
                        that.projects[loadedGame].gameName = loadedProjects[loadedGame].gameName;
                        that.projects[loadedGame].format = loadedProjects[loadedGame].format;
                    }
                    //... We always want to pick up any directories, since that's the only thing people can override in the UI.
                    that.projects[loadedGame].dir = loadedProjects[loadedGame].dir;
                }
            } else {
                fileSystem.makeDirectory( path.join(process.cwd(), 'Data'));
            }
        }
    };

    return index;
});
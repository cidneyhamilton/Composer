define(function(require) {
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        commonDialogs = require('infrastructure/commonDialogs'),
        app = require('durandal/app');

    var projectPath = path.join(process.cwd(), 'Data/projectSelector.json');

    var index = {
        load: function(selectedProject) {
            var that = this;
            that.activeProject = that.projects[selectedProject];
            // Determines if we should show the full list of nodes in the editor, or just a partial list
            // TODO: Currently checking the JSON/Ink flag.
            that.showAdvanced = that.activeProject.format == 'json'
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
                    assetDirectory: '../Game/Assets/Resources/Composer/',
                    format: 'json'
                },
                summerDazeFemale: {
                    gameName: 'Summer Daze: Female Protagonist',
                    gameInternalName: 'SummerDazeF',
                    dir: '',
                    assetDirectory: '../Game/Assets/Data/',                    
                    format: 'ink'
                },
                summerDazeMale: {
                    gameName: 'Summer Daze: Male Protagonist',
                    gameInternalName: 'SummerDazeM',
                    dir: '',
                    assetDirectory: '../Game/Assets/Data/',
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

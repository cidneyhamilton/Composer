define(function(require) {
    var path = requireNode('path'),
        inflection = require('./inflection'),
        fileSystem = require('./fileSystem'),
        serializer = require('plugins/serializer'),
        selectedGame = require('features/projectSelector/index');

    var ctor = function(name) {
        this.name = name;
        this.entries = [];
    };

    var endsWith = function(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    var LoadFiles = function(e) {
        var that = e;
     
        var i = 0;

        var dataDirectory = path.join(selectedGame.activeProject.dir, selectedGame.activeProject.assetDirectory, that.name);

        console.log(dataDirectory);

        if (fileSystem.exists(dataDirectory)) {
            that.entries = [];

            var dir = dataDirectory + "/";
            //console.log(dir);
            var files = fileSystem.readDir(dir);
            for(var i=0;i<files.length;i++) {
                var file = files[i];
                var fullname = dir + file;
                if (!endsWith(file, "meta")) {
                    that.entries.push(file);
                }
            }

            that.entries.sort(function(a,b) {
                if(a.name == b.name)
                    return 0;
                if(a.name < b.name)
                    return -1;
                if(a.name > b.name)
                    return 1;
            });
        } else {
            fileSystem.makeDirectory(dataDirectory);
        }
    };

    ctor.prototype.load = function() {
      
        LoadFiles(this);

        return;
    };

    ctor.prototype.save = function() {

        // Noop
    };

    ctor.prototype.createEntry = function() 
    {
        // Noop
    };

    return ctor;
});
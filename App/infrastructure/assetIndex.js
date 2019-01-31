define(function(require) {
    var path = requireNode('path'),
        AssetEntry = require('./assetEntry'),
        inflection = require('./inflection'),
        fileSystem = require('./fileSystem'),
        serializer = require('plugins/serializer'),
        selectedGame = require('features/projectSelector/index');

    var ctor = function(name, CreateItem, CreateEntry, folderName, type) {
        this.name = name;
        this.folderName = folderName;
        this.type = type || inflection.singularize(this.name).toLowerCase();
        this.entries = [];
        this.lookup = {};
        this.CreateItem = CreateItem;
        this.CreateEntry = CreateEntry || AssetEntry;
    };


    var LoadIndexFiles = function(e) {
        var that = e;
     
        var i = 0;

        that.dataDirectory = path.join(selectedGame.activeProject.dir, '/Data/',  (that.folderName || that.name));

        //console.log(that.dataDirectory);

        if (fileSystem.exists(that.dataDirectory)) {
            var dir = that.dataDirectory + "/";
            //console.log(dir);
            var files = fileSystem.readDir(dir);
                for(var i=0;i<files.length;i++) {
                    var file = files[i];
                    var fullname = dir + file;

                    try {
                        var x = JSON.parse(fileSystem.read(fullname));

                        if (x != null) {
                            x.type = e.type;
                            var entry = new that.CreateEntry(that, x);

                            if (x.type == 'script') {
                                //console.log(x);
                                entry.triggerType = x.trigger.type;
                                //console.log(entry.triggerType);
                            }

                            that.lookup[entry.id] = entry;
                            that.entries.push(entry);
                        }
                    }
                    catch(ex) {
                        console.log('Error parsing file: ' + fullname + ex);
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

        LoadIndexFiles(this);
        return;
    };

    ctor.prototype.save = function() {

        that = this;
        that.entries.sort(function(a,b){
                if(a.name == b.name)
                    return 0;
                if(a.name < b.name)
                    return -1;
                if(a.name > b.name)
                    return 1;
            });

            try
            {
                for(var i=0;i<that.entries.length;i++)
                {
                    var obj = that.entries[i];
                    var obj_json = JSON.stringify(obj);
                }
            }
            catch(ex)
            {
                console.log(ex);
            }


        // Return an empty promise
        var promise = new Object();
        promise.then =function() { /* Do nothing*/   };

        return promise;
    };

    ctor.prototype.createEntry = function() {
        return new this.CreateEntry(this, { type: this.type });
    };

    return ctor;
});
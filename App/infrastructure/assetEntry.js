define(function(require) {
    var system = require('durandal/system'),
        app = require('durandal/app'),
        path = requireNode('path'),
        fileSystem = require('./fileSystem'),
        serializer = require('plugins/serializer'),
        serializationConstants = require('features/constants/serialization');
        toastr = require('toastr');

    var ctor = function(index, properties) {
        if (!properties) {
            properties = {};
        }

        this.index = index;
        this.id = properties.id || system.guid();
        this.type = properties.type;
        this.name = properties.name || 'New ' + this.type.charAt(0).toUpperCase() + this.type.slice(1);
        this.displayName = properties.displayName || properties.name;
        this.itemFilePath = path.join(index.dataDirectory, this.id + ".json");
    //    this.itemHeaderFilePath = path.join(index.dataDirectory + "/index/", this.id + ".json");  
    };

    ctor.prototype.open = function(defaultAttributes) {
        var that = this;
        var exists = fileSystem.exists(that.itemFilePath);
        if (that.item) {
            return that.item;
        }

        if (exists) {
            var raw =  fileSystem.read(that.itemFilePath);
            that.originalJSON = String(raw);
            var data = serializer.deserialize(that.originalJSON, 4);
            that.item = data;
            return that.item;
        } else {
            defaultAttributes =  defaultAttributes || {};
            defaultAttributes.id = that.id;
            defaultAttributes.name = that.name;
            defaultAttributes.displayName = that.displayName;
            return that.item = new that.index.CreateItem(defaultAttributes);
        }
    };

    ctor.prototype.hasChanged = function() {
        var currentJson = serializer.serialize(this.item, 4);
        return currentJson != this.originalJSON;
    };

    ctor.prototype.refreshFromItem = function() {
        this.name = this.item.name;
        this.displayName = this.item.displayName;
    };

    ctor.prototype.save = function(suppressNotification) {
        var that = this;
        
        var jsonString = serializer.serialize(that.item, serializationConstants.serializerSettings);

        this.refreshFromItem();

        fileSystem.write(that.itemFilePath, jsonString);
        if (that.index.entries.indexOf(that) == -1) {
            that.index.lookup[that.id] = that;
            that.index.entries.push(that);
        }

        that.index.save();
        if (!suppressNotification) {
            toastr.success("'" + that.name + "' successfully saved.", 'Save');
        }

        that.originalJSON = jsonString;
    };

    ctor.prototype.close = function() {
        var that = this;
        return system.defer(function(dfd) {
            delete that.item;
            delete that.originalJSON;
            dfd.resolve();
        }).promise();
    };

    ctor.prototype.remove = function() {
        var that = this;
        var question = "Are you sure you want to delete '" + this.name + "'?";
        var options = ['Yes', 'No'];



        return app.showMessage(question, 'Delete', options).then(function(answer) {
            if (answer == 'Yes') {
                if (fileSystem.exists(that.itemFilePath)) {
                    fileSystem.remove(that.itemFilePath);
                }
                that.index.entries.remove(that);
                that.index.save();
                toastr.success("'" + that.name + "' successfully deleted.", 'Delete');
                return true;
            } else {
                return false;
            }
        });
    };

    ctor.prototype.toJSON = function() {
        return {
            id: this.id,
            name: this.name,
            displayName: this.displayName
        };
    };

    return ctor;
});
define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        display = require('infrastructure/display'),
        app = require('durandal/app'),
        triggerRegistry = require('./triggers/registry'),
        Interact = require('./triggers/interact'),
        Enter = require('./triggers/enter'),
        EntryPoint = require('./entryPoint'),
        EntryPointName = require('./entryPointName'),
        system = require('durandal/system'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodes/nodeEditor'),
        selectedGame = require('features/projectSelector/index');

    var props = assetDatabase.props.entries;
    var actors = assetDatabase.actors.entries;

    var ctor = function (owner, list, entry, filterProperty, filterValue) {
        this.owner = owner;
        this.entry = entry;
        this.filterProperty = filterProperty;
        this.filterValue = filterValue;
        this.list = list;

        this.storyEvents = assetDatabase.storyEvents.entries;
        this.scenes = assetDatabase.scenes.entries;       
        this.actors = assetDatabase.actors.entries;
        //this.props = assetDatabase.props.entries;

        NodeEditor.call(this);

        observable.defineProperty(this, 'props', function () {
            var sceneId = filterValue;
            return props.filter(function (item) {
                return item.sceneId == sceneId;
            });
        });
    };

    NodeEditor.baseOn(ctor);
    
    ctor.prototype.activate = function() {
        var that = this;
        var trigger;

        if(this.filterProperty == 'sceneId' || this.filterProperty == 'storyEventId'){
            trigger = new Enter();
        } else{
            trigger = new Interact();
        }
        
        var item = that.entry.open({ trigger:trigger });

	// Show a separate list of triggers for Summer Daze vs. Hero -U
        var triggers = selectedGame.showAdvanced ? triggerRegistry.all : triggerRegistry.base;

        that.availableTriggers = [item.trigger];

        for (var i = 0; i < triggers.length; i++) {
            var current = triggers[i];

            if (current.type != item.trigger.type) {
                if(!current.restrictions || current.restrictions.indexOf(that.owner.item.type) != -1){
                    that.availableTriggers.push(new current());
                }
            }
        }

        item[that.filterProperty] = that.filterValue;

        that.item = item;
        that.activeTab = item.entryPoints[0];
        ctor.currentScript = item;
    };

    ctor.prototype.addEntryPoint = function(){
        var that = this;
        EntryPointName.show().then(function(name){
            if(name){
                var entryPoint = new EntryPoint({id:system.guid(), name:name});
                that.item.entryPoints.push(entryPoint);
                that.activeTab = entryPoint;
            }
        });
    };

    ctor.prototype.removeEntryPoint = function(){
        this.item.entryPoints.remove(this.activeTab);
        this.activeTab = this.item.entryPoints[0];
    };

    ctor.prototype.goBack = function() {
        this.owner.refocus();
    };

    ctor.prototype.canDeactivate = function() {
        var that = this;

        if (that.entry.hasChanged()) {
            var message = "You have unsaved changes to '" + that.entry.name + "'. Would you like to save before closing?";

            return app.showMessage(message, 'Unsaved Changes', ['Yes', 'No', 'Cancel']).then(function(result) {
                if (result == 'Cancel') {
                    return false;
                }

                if (result == 'Yes') {
                    that.save();
                }
                return true;
            });
        }

        return true;
    };

    ctor.prototype.deactivate = function() {
        this.entry.close();
    };

    ctor.prototype.remove = function() {
        var that = this;
        var item = that.item;

        if (this.list) {
            this.list.remove(this.entry).then(function(success) {
                if (success) {
                    for (var i = 0; i < item.nodes.length; i++) {
                        var current = item.nodes[i];
                        if (current.remove) {
                            current.remove(item);
                        }
                    }

                    that.goBack();
                }
            });
        } else {
            that.entry.remove().then(function(success) {
                if (success) {
                    for (var i = 0; i < item.nodes.length; i++) {
                        var current = item.nodes[i];
                        if (current.remove) {
                            current.remove(item);
                        }
                    }

                    that.goBack();
                }
            });
        }
    };

    ctor.prototype.save = function() {
        var that = this;

        that.entry.save();
        if (that.list && that.list.scripts.indexOf(that.entry) == -1) {
            that.list.scripts.push(that.entry);
        }
    };

    return ctor;
});

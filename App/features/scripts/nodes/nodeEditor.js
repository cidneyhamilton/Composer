define(function(require) {
    var model = require('plugins/model'),
        NodeCreator = require('./nodeCreator'),
        dialog = require('plugins/dialog'),
        nodeRegistry = require('./registry'),
        ko = require('knockout'),
        system = require('durandal/system'),
        selectedGame = require('features/projectSelector/index');

    var deepCopy = false;

    var ctor = function() {
        if (NodeCreator.isCreating) {
            this.mode = 'write';
            NodeCreator.isCreating = false;
        } else{
            this.mode = 'read';
        }

        // Determine if we should show only the basic nodes, or all nodes for 3D scripting
        var showAdvanced = selectedGame.activeProject.format == 'json';
        var nodes = showAdvanced ? nodeRegistry.addableNodes : nodeRegistry.baseNodes;

        this.availableNodes = nodes.map(function(item){
            return {
                displayName:item.displayName,
                ctor:item
            }
        });

        this.clipboard = ctor.clipboard;
    };

    ctor.prototype.beginEdit = function(){
        this.mode = 'write';
    };

    ctor.prototype.endEdit = function(){
        this.mode = 'read';
    };

    ctor.prototype.insertBefore = function(nodeToAdd){
        var ownerNodes = ctor.getOwnerNodes(this.owner);
        NodeCreator.isCreating = true;
        var index = ownerNodes.indexOf(this.node);
        ownerNodes.splice(index, 0, new nodeToAdd.ctor(undefined, true));
    };

    ctor.prototype.insertAfter = function(nodeToAdd){
        var ownerNodes = ctor.getOwnerNodes(this.owner);
        NodeCreator.isCreating = true;
        var index = ownerNodes.indexOf(this.node);
        ownerNodes.splice(index + 1, 0, new nodeToAdd.ctor(undefined, true));
    };

    ctor.prototype.cut = function(){
        var ownerNodes = ctor.getOwnerNodes(this.owner);
        var index = ownerNodes.indexOf(this.node);
        var removed = ownerNodes.splice(index, 1);
        deepCopy = false;
        this.clipboard(removed[0]);
    };

    ctor.prototype.copy = function(){
        deepCopy = true;
        this.clipboard(this.node);
    };

    ctor.DeepCopy = function(obj) {

        // If we're trying to DeepCopy a null value, we can just return null.
        if (null == obj) {
            return null;
        }

        // Instantiate a fresh copy of the object.
        var copy = new obj.__proto__.constructor;

        Object.getOwnPropertyNames(copy).forEach(function(propertyName) {
            // skip any system properties
            if (propertyName.indexOf("__") != -1) {
                return;
            }

            var p = obj[propertyName];

            // The ID should've been auto-generated in the constructor
            if (typeof p !== 'undefined' && propertyName != "id") {
                // Need to deep-clone any arrays (and generate new IDs)
                if (Array.isArray(p)) {
                    copy[propertyName] = [];
                    for (var i = 0; i < p.length; i++ ) {
                        copy[propertyName].push(ctor.DeepCopy(p[i]));
                    }
                // Also need to deep-clone any references (and generate new IDs)
                }else if (typeof p == "object") {
                    copy[propertyName] = ctor.DeepCopy(p);
                // For everything else, there's Javascript's copy-by-value.
                } else {
                    copy[propertyName] = p;
                }
            }
        });

        return copy;
    };

    ctor.getOwnerNodes = function(ownerInput) {
        var owner = ownerInput;

        // Normally, we want to return ownerInput.nodes.
        // However, if the owner is within a nodeCycle, we actually
        // want to return the node position inside the nodecycle.
        // So for a nodeCycle, the "real" owner is actually the node,
        // not the nodeCycle. 
        if (!owner.nodes) {
            owner = owner.node;
        }
        return owner.nodes;
    }

    ctor.prototype.pasteBefore = function(){
        var ownerNodes = ctor.getOwnerNodes(this.owner);
        var index = ownerNodes.indexOf(this.node);

        var obj = ctor.clipboard();
        var newObj = deepCopy ? ctor.DeepCopy(obj) : obj;

        ownerNodes.splice(index, 0, newObj);

        ctor.clipboard(null);
    };

    ctor.prototype.pasteAfter = function(){
        var ownerNodes = ctor.getOwnerNodes(this.owner);
        var index = ownerNodes.indexOf(this.node);

        var obj = ctor.clipboard();  
        var newObj = deepCopy ? ctor.DeepCopy(obj) : obj;

        ownerNodes.splice(index + 1, 0, newObj);

        ctor.clipboard(null);
    };

    ctor.prototype.remove = function(){
        var that = this;
        var ownerNodes = ctor.getOwnerNodes(that.owner);
        dialog.showMessage('Are you sure you want to remove this item?', 'Remove', ['Yes', 'No']).then(function(result){
            if(result == 'Yes'){
                ownerNodes.remove(that.node);
            }
        });
    };

    ctor.prototype.activate = function(owner, node){
        this.owner = owner;
        this.node = node;
    };

    ctor.baseOn = function(s) {
        model.baseOn(s, ctor);
    };

    ctor.clipboard = ko.observable();

    return ctor;
});
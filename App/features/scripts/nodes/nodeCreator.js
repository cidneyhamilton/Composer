define(function(require){
    var nodeRegistry = require('./registry');
    var selectedGame = require('features/projectSelector/index');

    var ctor = function() {

        // Determine if we should show only the basic nodes, or all nodes for 3D scripting
        var showAdvanced = selectedGame.activeProject.format == 'json';
        var nodes = showAdvanced ? nodeRegistry.addableNodes : nodeRegistry.baseNodes;

        this.availableNodes = nodes.map(function(item){
            return {
                displayName:item.displayName,
                ctor:item
            }
        });
    };

    ctor.prototype.addNode = function(nodeToAdd){
        ctor.isCreating = true;
        this.item.nodes.push(new nodeToAdd.ctor(undefined, true));
    };

    ctor.prototype.activate = function(item){
        this.item = item;
    }

    ctor.isCreating = false;

    return ctor;
});

define(function(require){
    var nodeRegistry = require('./registry');

    var ctor = function(){
        this.availableNodes = nodeRegistry.addableNodes.map(function(item){
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

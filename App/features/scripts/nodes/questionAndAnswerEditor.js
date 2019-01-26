define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        TextOption = require('./options/textOption'),
        dialog = require('plugins/dialog');

    var ctor = function() {
        NodeEditor.call(this);

        this.actors = assetDatabase.actors.entries;

        observable.defineProperty(this, 'actor', function(){
            var that = this;

            var results = that.actors.filter(function(item){
                return item.id == that.node.actorId;
            });

            return results[0] || { name:'???' };
        });
    };

    NodeEditor.baseOn(ctor);

    ctor.prototype.addOption = function(){
        this.node.options.push(new TextOption());
    };

    ctor.prototype.removeOption = function(option){
        var that = this;
        dialog.showMessage('Are you sure you want to remove this option?', 'Remove', ['Yes', 'No']).then(function(result){
            if(result == 'Yes'){
                that.node.options.remove(option);
            }
        });
    };

    return ctor;
});
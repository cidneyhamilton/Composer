define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        ConditionEditor = require('./conditionEditor'),
        observable = require('plugins/observable'),
        InventoryItemSelected =  require('./inventoryItemSelected');

    var props = assetDatabase.props.entries;

    var ctor = function() {
        this.scenes = assetDatabase.scenes.entries;

        observable.defineProperty(this, 'props', function(){
            var sceneId = this.expression.sceneId;

            var list = props.filter(function(item){
                return item.sceneId == sceneId;
            });

            list.push({ name:'Any Other Item', id:InventoryItemSelected.otherItem });

            return list;
        });
    };

    ConditionEditor.baseOn(ctor);

    return ctor;
});

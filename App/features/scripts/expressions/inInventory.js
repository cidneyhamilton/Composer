define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.propId = attributes.propId || null;
        this.sceneId = attributes.sceneId || null;
        this.has = !!attributes.has;
    };

    ctor.prototype.getDescription = function(){
        var that = this;

        var results = assetDatabase.props.entries.filter(function(item){
            return item.id == that.propId;
        });

        var prop = results[0] || { name:'???' };

        return '<span class="prop">' + prop.name + '</span> is ' + (this.has ? '' : 'not') + ' in inventory';
    };

    ctor.type = 'expressions.inInventory';
    ctor.displayName = 'In Inventory';

    return ctor;
});
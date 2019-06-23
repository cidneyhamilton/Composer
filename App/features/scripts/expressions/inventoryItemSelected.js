define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.propId = attributes.propId || null;
        this.sceneId = attributes.sceneId || null;
    };

    ctor.prototype.getDescription = function(){
        var that = this;

        var prop =  assetDatabase.props.lookup[that.propId] || (this.propId == ctor.otherItem ? { name:'Other Item' } : { name:'???' });

        return '<span class="prop">' + prop.name + '</span> selected from inventory';
    };

    ctor.otherItem = 'CAF157D5-3493-48CD-ABB6-219D378FD28E'.toLowerCase();
    ctor.type = 'expressions.inventoryItemSelected';
    ctor.displayName = 'Inventory Item Selected';

    return ctor;
});
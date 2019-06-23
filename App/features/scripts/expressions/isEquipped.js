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

        var prop =  assetDatabase.props.lookup[that.propId] || { name:'???' };

        return '<span class="prop">' + prop.name + '</span> is equipped';
    };

    ctor.type = 'expressions.isEquipped';
    ctor.displayName = 'Is Equipped';

    return ctor;
});
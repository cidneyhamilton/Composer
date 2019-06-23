define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase');
    var observable = require('plugins/observable');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.propId = attributes.propId || null;
        this.sceneId = attributes.sceneId || currentSceneId;
        this.status = attributes.status || 0;
    };

    ctor.prototype.getDescription = function(){
        var that = this;

        var prop = assetDatabase.props.lookup[that.propId] || { name:'???' };

        return '<span class="prop">' + prop.name + '</span> is ' + this.status;
    };

    ctor.type = 'expressions.propStatus';
    ctor.displayName = 'Prop Status';

    return ctor;
});
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

        var results = assetDatabase.props.entries.filter(function(item){
            return item.id == that.propId;
        });

        var prop = results[0] || { name:'???' };

        return '<span class="prop">' + 'movement status' + '</span> is ' + this.status;
    };

    ctor.type = 'expressions.movementStatus';
    ctor.displayName = 'Movement Status';

    return ctor;
});
define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        PropEditor = require('./propEditor'),
        app = require('durandal/app');

    var ctor = function(owner, sceneId) {
        this.name = 'Props';
        this.sceneId = sceneId;
        this.owner = owner;
    };

    ctor.prototype.activate = function(){
        var that = this;

        this.props = assetDatabase.props.entries.filter(function(item){
            return item.sceneId == that.sceneId;
        });
    };

    ctor.prototype.create = function() {
        var entry = assetDatabase.props.createEntry();
        app.trigger('app:navigate:screen', new PropEditor(this, entry, this.sceneId, this.owner));
    };

    ctor.prototype.edit = function(entry) {
        app.trigger('app:navigate:screen', new PropEditor(this, entry, this.sceneId, this.owner));
    };

    ctor.prototype.remove = function(entry) {
        var that = this;

        entry.remove().then(function(){
            that.props = assetDatabase.props.entries.filter(function(item){
                return item.sceneId == that.sceneId;
            });
        });
    };

    return ctor;
});
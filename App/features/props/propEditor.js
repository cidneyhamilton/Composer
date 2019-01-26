define(function(require) {
    var Editor = require('features/shared/editor'),
        PropDetail = require('./propDetail'),
        app = require('durandal/app');

    var ctor = function(owner, entry, sceneId, sceneIndex) {
        Editor.call(this, owner, entry, new PropDetail(), 'propId');
        this.sceneId = sceneId;
        this.sceneIndex = sceneIndex;
    };

    Editor.baseOn(ctor);

    ctor.prototype.onOpen = function(item){
        item.sceneId = this.sceneId;
    };

    ctor.prototype.goBack = function() {
        app.trigger('app:navigate:screen', this.sceneIndex);
    };

    return ctor;
});
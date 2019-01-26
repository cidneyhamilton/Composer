define(function(require) {
    var app = require('durandal/app'),
        model = require('plugins/model');

    var ctor = function(index, Editor) {
        this.viewStyle = 'table';
        this.index = index;
        this.Editor = Editor;
        this.viewUrl = 'features/shared/index.html';
    };

    ctor.prototype.changeViewStyle = function(style) {
        this.viewStyle = style;
    };

    ctor.prototype.create = function() {
        var entry = this.index.createEntry();
        app.trigger('app:navigate:screen', new this.Editor(this, entry));
    };

    ctor.prototype.edit = function(entry) {
        app.trigger('app:navigate:screen', new this.Editor(this, entry));
    };

    ctor.prototype.remove = function(entry) {
        entry.remove();
    };

    ctor.baseOn = function(s) {
        model.baseOn(s, ctor);
    };

    return ctor;
});
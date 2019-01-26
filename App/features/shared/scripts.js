define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        Editor = require('features/scripts/editor'),
        List = require('features/scripts/list'),
        activator = require('durandal/activator');

    var ctor = function(filterProperty, filterValue) {
        this.name = 'Scripts';
        this.filterProperty = filterProperty;
        this.filterValue = filterValue;
        this.listScreen = new List(this, filterProperty, filterValue);
        this.activeScreen = activator.create(this.listScreen);
    };

    ctor.prototype.refocus = function() {
        this.activeScreen.activateItem(this.listScreen);
    };

    ctor.prototype.create = function() {
        var entry = assetDatabase.scripts.createEntry();
        this.activeScreen.activateItem(new Editor(this, this.listScreen, entry, this.filterProperty, this.filterValue));
    };

    ctor.prototype.edit = function(entry) {
        this.activeScreen.activateItem(new Editor(this, this.listScreen, entry, this.filterProperty, this.filterValue));
    };

    return ctor;
});
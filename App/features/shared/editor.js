define(function(require) {
    var app = require('durandal/app'),
        model = require('plugins/model'),
        activator = require('durandal/activator'),
        Scripts = require('./scripts'),
        Notes = require('./notes'),
        RawData = require('./rawData');

    var ctor = function(owner, entry, detailScreen, scriptFilterProperty) {
        this.owner = owner;
        this.entry = entry;
        this.screens = [
            detailScreen,
            new Scripts(scriptFilterProperty, entry.id),
            new Notes(),
            new RawData(this)
        ];
        this.activeItem = activator.create();
        this.viewUrl = 'features/shared/editor.html';
    };

    ctor.prototype.activate = function() {
        var that = this;

        if (this.entry.item) {
            return;
        }

        var item = this.entry.open();
        that.item = item;
        that.isInitialized = true;

        for (var i = 0; i < that.screens.length; i++) {
            var screen = that.screens[i];
            screen.item = item;
            screen.itemEntry = that.entry;
            if (screen.activate) {
                screen.activate();
            }
        }

        // If we haven't previously selected a tab, default it to the first item in the list.
        // Otherwise, preserve the original activation (so that the "Back" button always brings us back to the original tab)
        if (!that.isActivated) {
            that.isActivated = true;
            that.activeItem.activateItem(that.screens[0]);
        }

        if(that.onOpen){
            that.onOpen(item);
        }
    };

    ctor.prototype.canDeactivate = function() {
        var that = this;

        if (that.entry.hasChanged()) {
            var message = "You have unsaved changes to '" + that.entry.name + "'. Would you like to save before closing?";

            return app.showMessage(message, 'Unsaved Changes', ['Yes', 'No', 'Cancel']).then(function(result) {
                if (result == 'Cancel') {
                    return false;
                }

                if (result == 'Yes') {
                    that.save();
                }
                return true;
            });
        }

        return true;
    };

    ctor.prototype.deactivate = function() {
        this.entry.close();
    };

    ctor.prototype.remove = function() {
        var that = this;
        this.entry.remove().then(function(success) {
            if (success) {
                that.goBack();
            }
        });
    };

    ctor.prototype.save = function() {
        this.screens.forEach(function(screen) { if (screen.beforeSave) screen.beforeSave(); });
        this.entry.save();
    };

    ctor.prototype.activateItem = function(screen) {
        this.activeItem(screen);
    };

    ctor.prototype.goBack = function() {
        app.trigger('app:navigate:feature', this.owner.metadata);
    };

    ctor.baseOn = function(s) {
        model.baseOn(s, ctor);
    };

    return ctor;
});
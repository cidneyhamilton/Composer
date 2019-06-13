define(function(require) {
    var app = require('durandal/app'),
        model = require('plugins/model'),
        activator = require('durandal/activator'),
        ko = require('knockout'),
        system = require('durandal/system'),
        observable = require('plugins/observable'),
        system = require('durandal/system');

    // Define editor behaviours for specific constant groups here
    // Currently supported behaviours:
    //      multiSelect: (true if you can select > 1 category per option)
    //      categories: (array of {id: , value:} objects describing the stored value (id) and display value (name))
    var specialCases = {
        SkillsAndStats: {
            categories: [
                { id:'', name: ''},
                { id:'Skill', name: 'Skill'},
                { id:'Stat', name: 'Stat'}
            ]
        },
        Tags: {
            multiSelect: true,
            categories:  [
                { id:'script', name: 'Script'},
                { id:'storyEvent', name: 'Event'},
                { id:'scene', name: 'Scene'},
                { id:'actor', name: 'Actor'},
                { id:'prop', name: 'Prop'}
            ]
        }
    }

    ko.bindingHandlers.enumSafe = {
        init: function (element, valueAccessor) {
            $(element).on("keydown", function (event) {
                // Allow: backspace, delete, tab, escape, and enter
                if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                    // Allow: Ctrl+A
                    (event.keyCode == 65 && event.ctrlKey === true) ||
                    // Allow: . ,
                    (event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) ||
                    // Allow: home, end, left, right
                    (event.keyCode >= 35 && event.keyCode <= 39) ||
                    // Allow 0-9 on both number and keypad
                    (!event.shiftKey && ((event.keyCode > 47 && event.keyCode < 91) || (event.keyCode > 95 && event.keyCode < 106))) ||
                    // Allow a-z
                    (event.keyCode > 64 && event.keyCode < 91) ||
                    // Allow underscore
                    (event.shiftKey && event.keyCode == 189)) {
                    // let it happen, don't do anything
                    return;
                }
                else {
                    // Ensure that it is a number and stop the keypress
                    if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                        event.preventDefault();
                    }
                }
            });
        }
    };

    var ctor = function(owner, entry) {
        this.owner = owner;
        this.entry = entry;

        observable.defineProperty(this, 'categorySelectAttrs', function() {
            // If this item explicitly has a multiselect category,
            // we also need to override attributes on the <select> for the category
            if (this.item.name && specialCases[this.item.name].multiSelect) {
                return { multiple: true, size: specialCases[this.item.name].categories.length };
            }
            return {};
        });

        observable.defineProperty(this, 'multiSelectCategory', function() {
            // If this item explicitly has a multiselect category...
            return this.item.name && specialCases[this.item.name].multiSelect;
        });

        observable.defineProperty(this, 'categories', function() {
            // If this has a category available...
            if (this.item.name && specialCases[this.item.name].categories) {
                return specialCases[this.item.name].categories;
            }
            return [ { id:'', name: ''} ];
        });
    };

    ctor.prototype.addEntry = function(){
        this.item.entries.push({
            id: system.guid(),
            index: this.item.entries.length,
            name: '',
            category: [],
            active: true,
            notes:''
        });
    };

    ctor.prototype.activate = function() {
        var that = this;

        if (this.entry.item) {
            return;
        }

        var item = this.entry.open();
        that.item = item;
        that.isInitialized = true;

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
        this.entry.save();
    };

    ctor.prototype.goBack = function() {
        app.trigger('app:navigate:feature', this.owner.metadata);
    };

    return ctor;
});
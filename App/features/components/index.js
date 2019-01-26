define(function(require) {
    var app = require('durandal/app'),
        assetDatabase = require('infrastructure/assetDatabase')

    var allComponents = [
        require('./characterModel'),
        require('./combatEffectComponent'),
        require('./consumableBuffComponent'),
        require('./damageComponent'),
        require('./defenceComponent'),
        require('./debuffComponent'),
        require('./equipableBuffComponent'),
        require('./healingComponent'),
        require('./initialTags'),
        require('./inventoryItemComponent'),
        require('./picklockComponent'),
        require('./poisonComponent'),
        require('./throwingComponent'),
        require('./prefabReferenceComponent'),
        require('./requiresTargetComponent')
    ];

    var Controller = function(y){
        this.props = assetDatabase.props.entries;
        this.y = y || '300px';
    };

    Controller.allComponents = allComponents;

    Controller.prototype.activate = function(entity){
        this.entity = entity;

        this.availableComponents = allComponents
            .filter(function(item){
                return item.isCompatibleWith(entity);
            }).map(function(item){
                return {
                    displayName:item.displayName,
                    ctor:item
                }
            });
    };

    Controller.prototype.addComponent = function(component){
        var components = this.entity.components;

        for (var i = 0; i < components.length; i++) {
            var current = components[i];
            if (current instanceof component.ctor) {
                return;
            }
        }

        components.push(new component.ctor());
    };

    Controller.prototype.removeComponent = function(component){
        var components = this.entity.components;
        app.showMessage('Are you sure you want to remove the "' + component.constructor.displayName + '" component?', 'Remove Component', ['Yes', 'No']).then(function(answer) {
            if (answer == 'Yes') {
                components.remove(component);
            }
        });
    };

    return Controller;
});
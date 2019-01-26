define(function(require) {
    var db = require('infrastructure/assetDatabase'),
        system = require('durandal/system');
    var inventorySceneId = "a2508b7e-a177-4a96-93bd-4d8ab88dffc4";

	var inventoryItemTypes = [
        { name: 'Other', id: '0'},
        //{ name: 'Consumable', id: '1'},
        { name: 'Trap', id: '2'},
        { name: 'Rune', id: '3'},
        { name: 'Footwear', id: '4'},
        { name: 'Headwear', id: '5'},
        { name: 'Weapon', id: '6'},
        { name: 'BodyArmour', id: '7'},
        { name: 'Leggings', id: '8'},
        { name: 'Neckwear', id: '9'},
        { name: 'Belt', id: '10'},
        { name: 'Gloves', id: '11'},
        { name: 'Throwing Dagger', id: '12'},
        { name: 'Ring', id: '13'},
        { name: 'Ingredient', id: '14'},
        { name: 'Key', id: '15'},
        { name: 'Lockpick', id: '16'},
        { name: 'Backwear', id: '17'},
        { name: 'Potion', id: '18'},
        { name: 'Bandages', id: '19'},
        { name: 'Bottle', id: '20'},
        { name: 'Edible', id: '21'},
        { name: 'WaxDagger', id: '22'},
        { name: 'Gun', id: '23'}  
    ];

    var inventoryBagTypes = [
        { name: 'Default', id: '0'},
        { name: 'ProToolkit', id: '1'},
        { name: 'HerbBag', id: '2'},
        { name: 'ChemistryKit', id: '3'},
        { name: 'MagicBag', id: '4'},
        { name: 'DratSack', id: '5'}
    ];

    var combatBagTypes = [
        { name: 'None', id: '0'},
        { name: 'Healing', id: '1'},
        { name: 'Traps', id: '2'},
        { name: 'MagicScience', id: '3'},
        { name: 'Buffs', id: '4'},
        { name: 'ThrowingItems', id: '5'}
    ];

    var toolClasses = [
        { name: 'Invalid', id: '0'},
        { name: 'Wooden', id: '1'},
        { name: 'Standard', id: '2'},
        { name: 'Magical', id: '3'},
        { name: 'Houdini', id: '4'}
    ];

    var throwActions = [
        { id:'0', name: 'Default'},
        { id:'1', name: 'Return'},
        { id:'2', name: 'Break'}
    ];

    var throwEffects = [
        { id:'0', name: 'Default'},
        { id:'1', name: 'Fire'},
        { id:'2', name: 'FireArea'},
        { id:'3', name: 'Sleep'},
        { id:'4', name: 'Gooey'},
        { id:'5', name: 'Blind'},
        { id:'6', name: 'Itchy'}      
    ];

    var throwModelTypes = [
        { id:'0', name: 'Dagger'},
        { id:'1', name: 'Bottle'},
        { id:'2', name: 'Bag'},
        { id:'3', name: 'Boom'}
    ];

    var propArr = [];
    var propMap = {};

    // Create a map of {Id : Name} containing all Inventory props
    function populateProps() {
        return system.defer(function(dfd){
            for (var i = 0; i < db.props.entries.length ; i++) {
                if (db.props.entries[i].sceneId == inventorySceneId) {
                    var prop = {};
                    prop.name = db.props.entries[i].name;
                    prop.id = db.props.entries[i].id;
                    propArr.push(prop);
                    propMap[prop.id] = prop.name;
                }
            }
            dfd.resolve();
        }).promise();
    }

    return {
        allItems: function() {
            if (0 == propArr.length) {
                populateProps();
            }
            return propArr;
        },
        itemTypes: inventoryItemTypes,
        getItemTypeById: function(id) {
            if (typeof id !== 'undefined') {
                // This is because the id:'1' entry is commented out above.
                // If it's uncommented, please just use parseInt(id) (remove the "else" logic)
                if (id == '0') {
                    return inventoryItemTypes[parseInt(id)].name;
                } else {
                    return inventoryItemTypes[parseInt(id) - 1].name;
                }
            }
        },
        getItemsById: function(ids) {
            if (ids && ids.length > 0) {
                var names = [];
                for (var i = 0; i < ids.length; i++) {
                    names.push(propMap[ids[i]]);
                }
                return names;
            }
            return null;
        },
        inventoryBagTypes: inventoryBagTypes,
        getInventoryBagById: function(id) {
            if (typeof id !== 'undefined') {
                return inventoryBagTypes[parseInt(id)].name;
            }
        },
        combatBagTypes: combatBagTypes,
        getCombatBagById:  function(id) {
            if (typeof id !== 'undefined') {
                return combatBagTypes[parseInt(id)].name;
            }
        },
        toolClasses: toolClasses,
        getToolClassById: function(id) {
            if (typeof id !== 'undefined') {
                return toolClasses[parseInt(id)].name;
            }
        },
        throwActions: throwActions,
        getThrowActionById: function(id) {
            if (typeof id !== 'undefined') {
                return throwActions[parseInt(id)].name;
            }
        },
        throwEffects: throwEffects,
        getThrowEffectById: function(id) {
            if (typeof id !== 'undefined') {
                return throwEffects[parseInt(id)].name;
            }
        },
        throwModelTypes: throwModelTypes,
        getThrowModelTypeById: function(id) {
            if (typeof id !== 'undefined') {
                return throwModelTypes[parseInt(id)].name;
            }
        },
    };
});
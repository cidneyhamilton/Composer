var inventoryPicklists;
var soundEffects;

define(function(require) {
    if (!inventoryPicklists) {
        inventoryPicklists = require('features/constants/inventoryPicklists');
        var assetDatabase = require('infrastructure/assetDatabase');
        soundEffects = assetDatabase.soundEffects.entries;
    }
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.ItemType = attributes.ItemType || 0;
        this.ItemBag = attributes.ItemBag || 0;
        this.CombatUseFilter = attributes.CombatUseFilter || 0;
        this.IsDiscardable = attributes.IsDiscardable || false;
        this.IsThrowable = attributes.IsThrowable || false;
        this.IsGift = attributes.IsGift || false;
        this.IsQuestItem = attributes.IsQuestItem || false;
        this.IsCombatItem = attributes.IsCombatItem || false;
        this.Charges = attributes.Charges || -1;
        this.Stackable = attributes.Stackable || 1;
        this.soundEffectName = attributes.soundEffectName || null;
    };

    /** NOTE:  IF YOU CHANGE SOMETHING HERE, YOU HAVE TO CHANGE IT IN InventoryItemComponent.cs TOO!! **/
    this.defaultSoundEffectName = function(typeOfItem) {
        switch (typeOfItem) {
            case "9":  // Neckwear
            case "13": // Ring
                return 'coins_collect.wav';
            case "6":  // Weapon
            case "12": // Throwing Dagger
                return 'knife_pickup.wav';
            case "18": // Potions
            case "20": // Bottles
                return 'bottle_pickup_full.wav';
            default:
                return 'pickup_generic.wav';
        }
    }

    this.playSound = function(soundName) {
        var fullname = assetDatabase.soundEffects.dataDirectory + "/" + soundName;
        var snd = new Audio(fullname); // buffers automatically when created
        snd.play();
    };

    ctor.displayName = 'Inventory Item Component';
    ctor.type = 'components.inventoryItem';

    var compatibleTypes = ['prop'];
    ctor.isCompatibleWith = function(entity){
        return compatibleTypes.indexOf(entity.type) != -1;
    };

    return ctor;
});
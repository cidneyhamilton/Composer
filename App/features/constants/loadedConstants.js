define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        skillsAndAttributes = require('features/constants/skillsAndAttributes');

    var generatedConstants = function(constantEntry) {
        this.entries = [];
        this.allEntries = [];

        constantEntry.open();
        var innerEntries = constantEntry.item.entries;
        for (var i = 0; i < innerEntries.length; i ++) {
            // Only add active entries into the mappings
            if (innerEntries[i].active) {
                // Add the thing to the ordered list of active skills and stats.
                this.entries.push({id: '' + innerEntries[i].index, name: innerEntries[i].name});
            }
            // Add the thing to the ordered list of all skills and stats.
            this.allEntries.push({id: '' + innerEntries[i].index, name: innerEntries[i].name});
        }
        constantEntry.close();
    }

    generatedConstants.prototype.getNameById = function(id) {
        if (typeof id !== 'undefined') {
             return this.allEntries[parseInt(id)].name;
        }
    };

    var ctor = function () {
    };

    ctor.prototype.load = function() {
        this.constants = {};

        // First scan all constants and load any required ones
        var constantCategories = {};
        for (var i = 0; i < assetDatabase.constants.entries.length; i++) {
            var constantEntry = assetDatabase.constants.entries[i];
            if ("SkillsAndStats" === constantEntry.name) {
                this.constants[constantEntry.name] = skillsAndAttributes.init(constantEntry);
            } else {
                this.constants[constantEntry.name] = new generatedConstants(constantEntry);
            }
        }

        this.inventorySceneId = '';
        this.achievementsSceneId = '';
        this.questsSceneId = '';

        // Also parse all scenes and retrieve the _Inventory, _Achievements, and _Tasks SceneIds
        for (var i = 0; i < assetDatabase.scenes.entries.length; i++) {
            var sceneEntry = assetDatabase.scenes.entries[i];
            if ("_Inventory" === sceneEntry.name) {
                this.inventorySceneId = sceneEntry.id;
            } else if ("_Achievements" === sceneEntry.name) {
                this.achievementsSceneId = sceneEntry.id;
            } else if ("_Tasks" === sceneEntry.name) {
                this.questsSceneId = sceneEntry.id;
            }
        }
    }

    return new ctor();
});
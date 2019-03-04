define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'), 
        path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system'),
        selectedGame = require('features/projectSelector/index'),
        getSlug = require('infrastructure/getSlug'),

        achievementsTemplate = require('text!features/build/unity3d/csharp/achievementsTemplate.txt'),
        inventoryIdsTemplate = require('text!features/build/unity3d/csharp/inventoryIdsTemplate.txt'),
        questsTemplate = require('text!features/build/unity3d/csharp/questsTemplate.txt'),
        localizationGroupTemplate = require('text!features/build/unity3d/csharp/localizationGroupTemplate.txt'),
        nonLocalizedNamesTemplate = require('text!features/build/unity3d/csharp/nonLocalizedNamesTemplate.txt'),

        actorDrawerTemplate = require('text!features/build/unity3d/csharp/actorDrawerTemplate.txt'),
        propDrawerTemplate = require('text!features/build/unity3d/csharp/propDrawerTemplate.txt'),
        scriptDrawerTemplate = require('text!features/build/unity3d/csharp/scriptDrawerTemplate.txt'),

        registryTemplate = require('text!features/build/unity3d/csharp/registryTemplate.txt')
        ;

    var baseItem = function(contextOutputDir, fileName, template, templateFormat, lineFormat) {
        var item = {
            contextOutputDir: contextOutputDir,
            fileName: fileName,
            template: template,
            format: lineFormat,
            templateFormat: templateFormat,
            output: "",
            addOutput: function(lineToAdd) {
                var that = this;
                that.output += lineToAdd + "\r\n";
            },
            preTemplateGen: function() {
            },
            templateGen: function() {
                var that = this;
                that.output = that.template.replace(that.templateFormat, that.output);
            },
            postTemplateGen: function() {
            }
        };
        return item;
    }

    var baseItemWithSubItems = function(contextOutputDir, fileName, template, templateFormat, lineFormat, subEntryFormat, removeEndingComma) {
        var item = baseItem(contextOutputDir, fileName, template, templateFormat, lineFormat);
        item.removeEndingComma = removeEndingComma;
        item.subEntryFormat = subEntryFormat;
        // Map of [subEntry.id, subEntry.output]
        item.subEntries = {};
        item.initSubEntry = function(subEntryId) {
            if (!item.subEntries[subEntryId]) {
                item.subEntries[subEntryId] = ""; 
            }          
        };
        item.addSubEntry = function(subEntryId, output) {
            item.initSubEntry(subEntryId);
            item.subEntries[subEntryId] += output + "\r\n";
        };
        item.preTemplateGen = function() {
            if (item.removeEndingComma) {
                for (var subEntryId in item.subEntries) {
                    item.output = item.output.replace('{' + subEntryId + '}', item.subEntries[subEntryId].slice(0, -3));
                }
                item.output = item.output.slice(0, -3);
            } else {
                for (var subEntryId in item.subEntries) {
                    item.output = item.output.replace('{' + subEntryId + '}', item.subEntries[subEntryId]);
                }                
            }
        };
        return item;
    }

    var codeGenItem = function(fileName, sceneId, template, lineFormat) {
        var item = baseItem('codeGenOutputDirectory', fileName, template, "/*{{ListItems}}*/", lineFormat);
        item.sceneId = sceneId;
        return item;
    };

    var baseRegistryGenItem = function(entityName, entityType, lineFormatType) {
        var lineFormat = '        public static {entityType} {slug} { get { return Game.' + lineFormatType + '.Get<{entityType}>(new Guid("{id}"));  } }'
        var item = baseItem('codeOutputDirectory', entityName + 's', registryTemplate, "{field declarations}", lineFormat);
        item.entityName = entityName;
        item.entityType = entityName + entityType;
        item.postTemplateGen = function() {
            item.output = item.output.replace(/{entity}/g, item.entityName);
            item.output = item.output.replace(/{entityType}/g, item.entityType);
        };
        return item;
    }

    var registryGenItem = function(entityName) {
        return baseRegistryGenItem(entityName, 'Model', 'Model');
    };

    var registryInstancedGenItem = function(entityName) {
        return baseRegistryGenItem(entityName, 'Instance', 'Registry');
    };

    var drawerGenItem = function(fileName, template, lineFormat) {
        return baseItemWithSubItems('editorOutputDirectory', fileName, template, '{list items}', lineFormat, '                    new Item.ChildItem("{childId}", "{childName}"),', true);
    }

    var ctor = function () {
        baseProcessor.call(this);
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.init = function() {
        var achievementsSceneId = 'a4d66827-dd60-451f-8015-62b8abb42f0c';
        var inventorySceneId = 'a2508b7e-a177-4a96-93bd-4d8ab88dffc4';
        var questsSceneId = 'e8520824-d970-4c6e-8aec-6c308c8846ab';

        this.achievements = codeGenItem('Achievements', achievementsSceneId, achievementsTemplate, '            {new Guid("{id}"), new Achievement(new Guid("{id}")) },');
        this.inventory = codeGenItem('InventoryItems', inventorySceneId, inventoryIdsTemplate, '            {new Guid("{id}"), new InventoryId(new Guid("{id}")) },');
        this.quests = codeGenItem('Quests', questsSceneId, questsTemplate, '            {new Guid("{id}"), new Quest(new Guid("{id}"), "{name}", {value} ) },');

        this.localizationGroups = baseItem('codeOutputDirectory', 'LocalizationGroups', localizationGroupTemplate, '{localizationGroups}');
        this.nonLocalizedNames = baseItemWithSubItems('codeOutputDirectory', 'NonLocalizedNames', nonLocalizedNamesTemplate, '{MadeUpValueSinceItIsNotUsedHere}');
        // Terrible, but nonlocalizedNames does stuff post-gen rather than pre-gen.  WTF was I thinking?
        this.nonLocalizedNames.postTemplateGen = function() { this.preTemplateGen(); };

        this.actorsRegistry = registryGenItem('Actor');
        this.scenesRegistry = registryInstancedGenItem('Scene');
        this.storyEventsRegistry = registryInstancedGenItem('StoryEvent');

        this.actorDrawer = drawerGenItem('ActorDrawer', actorDrawerTemplate, '            new Item("{id}", "{name}"),');
        this.propDrawer = drawerGenItem('PropDrawer', propDrawerTemplate, '            new Item("{name}") { \r\n                Children = new List<Item.ChildItem> {\r\n{childData}\r\n                }\r\n            },');
        this.scriptDrawer = drawerGenItem('ScriptDrawer', scriptDrawerTemplate, '            new Item("{name}") { \r\n                Children = new List<Item.ChildItem> {\r\n{childData}\r\n                }\r\n            },');

        this.codeGens = [//this.achievements, this.inventory, this.quests, 
                         //this.localizationGroups, 
                         this.nonLocalizedNames,
                         //this.actorsRegistry, this.scenesRegistry, this.storyEventsRegistry, 
                         //this.actorDrawer, this.propDrawer, this.scriptDrawer
                         ];
    };

    ctor.prototype.updateRegistry = function(registry, itemToUpdate) {
        registry.addOutput(registry.format.replace(/{slug}/g, getSlug(itemToUpdate.name)).replace(/{id}/g, itemToUpdate.id));
    };

    ctor.prototype.parseNonLocalizedName = function(assetType, assetEntry) {
        var name = assetEntry.name.replace(/"/g, '\\"');
        var displayName = (!!assetEntry.displayName ? assetEntry.displayName.replace(/"/g, '\\"') : name);
        this.nonLocalizedNames.addSubEntry(assetType, '            {"' + assetEntry.id + '", new KeyValuePair<string, string> ("' + name + '", "' + displayName + '") },');
    };

    ctor.prototype.parseLocalizationGroup = function(context, idMap, localizationGroup) {
        // update the localizationGroups
        this.localizationGroups.addOutput('        public static class ' + localizationGroup.name + ' { ');
        localizationGroup.entries.forEach(function(locEntry) {
            this.localizationGroups.addOutput('            public static readonly string ' + locEntry.id +' = "' + locEntry.id +'";');
        }, this);
        this.localizationGroups.addOutput('        }');
    };

    ctor.prototype.parseScene = function(context, idMap, scene) {
        // update the nonlocalizedNames
        this.parseNonLocalizedName('scenes', scene);

        // update the propDrawer
        this.propDrawer.addOutput(this.propDrawer.format.replace(/{name}/g, scene.name).replace('{childData}', '{' + scene.id + '}'));
        this.propDrawer.initSubEntry(scene.id); // Explicitly generate a subentry for this; it's possible we may not have any props for this scene, but still want to generate an empty entry for it.

        // update the scenesRegistry
        this.updateRegistry(this.scenesRegistry, scene);
    };

    ctor.prototype.parseActor = function(context, idMap, actor) {
        // update the nonlocalizedNames
        this.parseNonLocalizedName('actors', actor);

        // update the actorDrawer
        this.actorDrawer.addOutput(this.actorDrawer.format.replace(/{id}/g, actor.id).replace(/{name}/g, actor.name));

        // update the actorsRegistry 
        this.updateRegistry(this.actorsRegistry, actor);
    };

    ctor.prototype.parseStoryEvent = function(context, idMap, storyEvent) {
        // update the nonlocalizedNames
        this.parseNonLocalizedName('storyEvents', storyEvent);

        // update the storyEventsRegistry 
        this.updateRegistry(this.storyEventsRegistry, storyEvent);
    };

    ctor.prototype.parseProp = function(context, idMap, prop) {
        // update the nonlocalizedNames
        this.parseNonLocalizedName('props', prop);

        // update the codeGens
        if (this.achievements.sceneId == prop.sceneId) {
            this.achievements.addOutput(this.achievements.format.replace(/{id}/g, prop.id));
        } else if (this.inventory.sceneId == prop.sceneId) {
            this.inventory.addOutput(this.inventory.format.replace(/{id}/g, prop.id));
        } else if (this.quests.sceneId == prop.sceneId) {
            this.quests.addOutput(this.quests.format.replace(/{id}/g, prop.id).replace(/{name}/g, (!!prop.displayName) ? prop.displayName : prop.name).replace(/{value}/g, prop.value || 0));
        }

        // update the propDrawer
        if (idMap[prop.sceneId]) {
            this.propDrawer.addSubEntry(prop.sceneId, this.propDrawer.subEntryFormat.replace(/{childId}/g, prop.id).replace(/{childName}/g, prop.name) );
        }
    };

    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {
        // update the scriptDrawer
        if(script.sceneId && script.trigger.type == 'triggers.zone') {
            if(!this.scriptDrawer.subEntries[script.sceneId]) {
                // Write the line item for this sceneId, replacing the generic {childData} with {script.sceneId} for future parsing
                this.scriptDrawer.addOutput(this.scriptDrawer.format.replace(/{name}/g, idMap[script.sceneId]).replace('{childData}', '{' + script.sceneId + '}'));
            }
            this.scriptDrawer.addSubEntry(script.sceneId, this.scriptDrawer.subEntryFormat.replace(/{childId}/g, script.id).replace(/{childName}/g, script.name));
        }
    };

    ctor.prototype.finish = function(context, idMap) {
        baseProcessor.prototype.finish.call(this, context, idMap);

        fileSystem.makeDirectory(context.codeGenOutputDirectory);
        fileSystem.makeDirectory(context.codeOutputDirectory);
        fileSystem.makeDirectory(context.editorOutputDirectory);

        for (var i = 0; i < this.codeGens.length; i++) {
            var generating = this.codeGens[i];
            generating.preTemplateGen();
            generating.templateGen();
            generating.postTemplateGen();
            var fileName = path.join(context[generating.contextOutputDir], generating.fileName + '.cs'); 
            fileSystem.write(fileName, generating.output);
        }
    };

    return new ctor();
});
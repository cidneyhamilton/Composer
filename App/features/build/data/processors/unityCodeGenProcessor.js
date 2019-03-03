define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'), 
        path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system'),
        selectedGame = require('features/projectSelector/index'),
        speakingurl = require('speakingurl'),

        achievementsTemplate = require('text!features/build/unity3d/csharp/achievementsTemplate.txt'),
        inventoryIdsTemplate = require('text!features/build/unity3d/csharp/inventoryIdsTemplate.txt'),
        questsTemplate = require('text!features/build/unity3d/csharp/questsTemplate.txt'),
        registryTemplate = require('text!features/build/unity3d/csharp/registryTemplate.txt')
        ;

    var baseItem = function(fileName, template, templateFormat, lineFormat) {
        var item = {
            fileName: fileName,
            template: template,
            format: lineFormat,
            templateFormat: templateFormat,
            output: "",
            addOutput: function(lineToAdd) {
                var that = this;
                that.output += lineToAdd + "\r\n";
            }
        };
        return item;
    }

    var codeGenItem = function(fileName, sceneId, template, lineFormat) {
        var item = baseItem(fileName, sceneId, template, "/*{{ListItems}}*/", lineFormat);
        item.sceneId = sceneId;
        return item;
    };

    var baseRegistryGenItem = function(entityName, entityType, lineFormatType) {
        var lineFormat = '        public static {entityType} {slug} { get { return Game.' + lineFormatType + '.Get<{entityType}>(new Guid("{id}"));  } }'
        var item = baseItem(entityName + 's', registryTemplate, "{field declarations}", lineFormat);
        item.entityName = entityName;
        item.entityType = entityName + entityType;
        return item;
    }

    var registryGenItem = function(entityName) {
        return baseRegistryGenItem(entityName, 'Model', 'Model');
    };

    var registryInstancedGenItem = function(entityName) {
        return baseRegistryGenItem(entityName, 'Instance', 'Registry');
    };

    var ctor = function () {
        baseProcessor.call(this);

        this.outputDirectory = path.join(selectedGame.activeProject.dir, "../Game/Assets/CodeGen/");
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

        this.actorsRegistry = registryGenItem('Actor');
        this.scenesRegistry = registryInstancedGenItem('Scene');
        this.storyEventsRegistry = registryInstancedGenItem('StoryEvent');

        this.codeGens = [this.achievements, this.inventory, this.quests];
        this.registryGens = [this.actorsRegistry, this.scenesRegistry, this.storyEventsRegistry];
    };

    ctor.prototype.updateRegistry = function(registry, itemToUpdate) {
        var slug = speakingurl(itemToUpdate.name, {separator: "_", maintainCase: true}).replace(/-/, '_');
        registry.addOutput(registry.format.replace(/{slug}/g, slug).replace(/{id}/g, itemToUpdate.id));
    };

    ctor.prototype.parseScene = function(context, idMap, scene) {
        // update the scenesRegistry
        this.updateRegistry(this.scenesRegistry, scene);
    };

    ctor.prototype.parseActor = function(context, idMap, actor) {
        // update the actorsRegistry 
        this.updateRegistry(this.actorsRegistry, actor);
    };

    ctor.prototype.parseStoryEvent = function(context, idMap, storyEvent) {
        // update the storyEventsRegistry 
        this.updateRegistry(this.storyEventsRegistry, storyEvent);
    };

    ctor.prototype.parseProp = function(context, idMap, prop) {
        if (this.achievements.sceneId == prop.sceneId) {
            this.achievements.addOutput(this.achievements.format.replace(/{id}/g, prop.id));
        } else if (this.inventory.sceneId == prop.sceneId) {
            this.inventory.addOutput(this.inventory.format.replace(/{id}/g, prop.id));
        } else if (this.quests.sceneId == prop.sceneId) {
            this.quests.addOutput(this.quests.format.replace(/{id}/g, prop.id).replace(/{name}/g, (!!prop.displayName) ? prop.displayName : prop.name).replace(/{value}/g, prop.value || 0));
        }
    };

    ctor.prototype.finish = function(context, idMap) {
        baseProcessor.prototype.finish.call(this, context);

        fileSystem.makeDirectory(this.outputDirectory);

        for (var i = 0; i < this.codeGens.length; i++) {
            var generating = this.codeGens[i];
            var finalOutput = generating.template.replace(generating.templateFormat, generating.output);

            var fileName = path.join(this.outputDirectory, generating.fileName + '.cs'); 
            fileSystem.write(fileName, finalOutput);
        }

        for (var i = 0; i < this.registryGens.length; i++) {
            var generating = this.registryGens[i];
            var finalOutput = generating.template.replace(generating.templateFormat, generating.output);
            finalOutput = finalOutput.replace(/{entity}/g, generating.entityName);
            finalOutput = finalOutput.replace(/{entityType}/g, generating.entityType);

            var fileName = path.join(context.codeOutputDirectory, generating.fileName + '.cs'); 
            fileSystem.write(fileName, finalOutput);
        }
    };

    return new ctor();
});
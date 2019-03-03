define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'), 
        path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system'),
        achievementsTemplate = require('text!features/build/unity3d/csharp/achievementsTemplate.txt'),
        inventoryIdsTemplate = require('text!features/build/unity3d/csharp/inventoryIdsTemplate.txt'),
        questsTemplate = require('text!features/build/unity3d/csharp/questsTemplate.txt'),
        selectedGame = require('features/projectSelector/index');

    var codeGenItem = function(type, sceneId, template, lineFormat) {
        var item = {
            type: type,
            sceneId: sceneId,
            template: template,
            format: lineFormat,
            templateFormat: "/*{{ListItems}}*/",
            output: "",
            count: 0,
            addOutput: function(lineToAdd) {
                var that = this;
                that.output += lineToAdd + "\r\n";
                that.count ++;
            }
        };
        return item;
    }

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

        this.toGenerate = [this.achievements, this.inventory, this.quests];
    };

    ctor.prototype.parseProp = function(context, idMap, prop) {
        if (this.achievements.sceneId == prop.sceneId) {
            this.achievements.addOutput(this.achievements.format.replace('{id}', prop.id).replace('{id}', prop.id));
        } else if (this.inventory.sceneId == prop.sceneId) {
            this.inventory.addOutput(this.inventory.format.replace('{id}', prop.id).replace('{id}', prop.id));
        } else if (this.quests.sceneId == prop.sceneId) {
            this.quests.addOutput(this.quests.format.replace('{id}', prop.id).replace('{id}', prop.id).replace('{name}', (!!prop.displayName) ? prop.displayName : prop.name).replace('{value}', prop.value || 0));
        }
    };

    ctor.prototype.finish = function(context) {
        baseProcessor.prototype.finish.call(this, context);

        fileSystem.makeDirectory(this.outputDirectory);

        for (var i = 0; i < this.toGenerate.length; i++) {
            var generating = this.toGenerate[i];
            console.log(generating.type + " Count: " + generating.count);
            var finalOutput = generating.template.replace(generating.templateFormat, generating.output);

            var fileName = path.join(this.outputDirectory, generating.type + '.cs'); 
            fileSystem.write(fileName, finalOutput);

        }
    };

    return new ctor();
});
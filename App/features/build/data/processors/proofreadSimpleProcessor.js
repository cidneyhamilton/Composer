define(function(require){
    var baseProofreadProcessor = require('features/build/data/processors/baseProofreadProcessor'),
        heroStatusEffects = require('features/constants/heroStatusEffects'),
        skillOrStatMap = require('features/constants/skillsAndAttributes'),
        damageSourceTypes = require('features/constants/damageSourceTypes'),

        SKIPME = "~*~*~ {SKIP ME} ~*~*~";

    function parseComponent(component, property) {
        var returnVal = component[property];
        switch(property) {
            case "type" :
                returnVal = component.__proto__.constructor.displayName;
                break;
            case "DamageSourceType" :
                returnVal = damageSourceTypes.getDamageSourceById(component.DamageSourceType);
                break;
            case "alwaysHit" :
                returnVal = damageSourceTypes.getAlwaysHitById(component.alwaysHit);
                break;
            case "EffectType" :
                returnVal = heroStatusEffects.getStatusEffectById(component.EffectType);
                break;
            case "CuresDebuff" :
                returnVal =  heroStatusEffects.getStatusEffectById(component.CuresDebuff);
                break;
            case "ItemType" :
                returnVal = inventoryPicklists.getItemTypeById(component.ItemType);
                break;
            case "ItemBag" :
                returnVal = inventoryPicklists.getInventoryBagById(component.ItemBag);
                break;
            case "CombatUseFilter" :
                returnVal = inventoryPicklists.getCombatBagById(component.CombatUseFilter);
                break;
            case "toolClass" :
                returnVal = inventoryPicklists.getToolClassById(component.toolClass);
                break;
            case "throwAction" :
                returnVal = inventoryPicklists.getThrowActionById(component.throwAction);
                break;
            case "spawnEffect" :
                returnVal = inventoryPicklists.getThrowEffectById(component.spawnEffect);
                break;
            case "modelType" :
                returnVal = inventoryPicklists.getThrowModelTypeById(component.modelType);
                break;
            case "BuffTargetType" :
                returnVal = skillOrStatMap.getSkillOrStatById(component.BuffTargetType);
                break;
            case "BuffA":
            case "BuffB":
            case "BuffC":
                var buff = component[property];
                if (buff.Value) {
                    buff = skillOrStatMap.getSkillOrStatById(buff.Target) + ' (' + buff.Value + ')';
                    if (!!buff) {
                        returnVal = buff;
                    } else {
                        returnVal = SKIPME;
                    }
                } else {
                    returnVal = SKIPME;
                }
                break;
        }
        return returnVal;
    }

    var ctor = function () {
        this.actorFilename = 'actor_text';
        this.propFilename = 'prop_text';

        baseProofreadProcessor.call(this, this.actorFilename, this.propFilename);
        this.fileNameToType = {};
        this.fileNameToType[this.actorFilename] = 'Actor';
        this.fileNameToType[this.propFilename] = 'Prop';
    };

    ctor.prototype = Object.create(baseProofreadProcessor.prototype);
    ctor.prototype.constructor = baseProofreadProcessor;

    ctor.prototype.init = function() {
        baseProofreadProcessor.prototype.init.call(this);
        this.dataTables[this.actorFilename][""] = [];
    };

    ctor.prototype.parseActor = function(context, idMap, actor) {
        this.dataTables[this.actorFilename][""].push(actor);
    };

    ctor.prototype.parseProp = function(context, idMap, prop) {
        var sceneToPropMap = this.dataTables[this.propFilename][idMap[prop.sceneId]];
        if (null == sceneToPropMap) {
            this.dataTables[this.propFilename][idMap[prop.sceneId]] = [];
        }
        this.dataTables[this.propFilename][idMap[prop.sceneId]].push(prop);
    };

    ctor.prototype.createWriter = function(fileName, gameTextFilePath) {
        var defaultWriter = baseProofreadProcessor.prototype.createWriter.call(this, fileName, gameTextFilePath);
        defaultWriter.itemType = this.fileNameToType[fileName];
        return defaultWriter;
    }

    ctor.prototype.getPageTitle = function(writer) {
        return  writer.itemType + "s for " + baseProofreadProcessor.prototype.getPageTitle.call(this);
    };

    ctor.prototype.writeSidebarEntry = function(idMap, writer, scene, entry) {
        writer.write( (scene ? "<b>Scene</b>: " + scene + this.newline : "" )
                    + "<b>" + writer.itemType + " Name</b>: " + entry.name + this.newline
                    + "<b>" + writer.itemType + " Id</b>: " + entry.id + this.newline);
    };

    ctor.prototype.writeMainEntry = function(idMap, writer, scene, entry) {
        writer.write(this.listEntryStart
                    + "<b>Display Name</b>: " + ( !!entry.displayName ? entry.displayName : (entry.name + ' (same as name)'))
                    + this.listEntryEnd);
        if (entry.description) {
            writer.write(this.listEntryStart 
                    + "<b>Description</b>: " + entry.description + "\r\n"
                    + this.listEntryEnd);
        }
        if (entry.components && entry.components.length > 0) {
            writer.write("<hr/>\r\n");

            for (var i = 0; i < entry.components.length; i++) {
                var comp = entry.components[i];
                writer.write(this.listEntryStart
                            + parseComponent(comp, 'type') + this.newline
                            + this.listStart);
                Object.keys(comp).sort(function(a,b){return a.localeCompare(b)}).forEach(function(propertyName) {            
                    // skip any system properties
                    if (propertyName.indexOf("__") != -1) {
                        return;
                    }
                    // skip Type; we've displayed that separately
                    if ("type" == propertyName) {
                        return;
                    }
                    var componentPropertyValue = parseComponent(comp, propertyName);
                    if (SKIPME !== componentPropertyValue) {
                        writer.write(this.listEntryStart + propertyName + ': ' + componentPropertyValue + this.listEntryEnd);
                    }
                }, this);
                writer.write(this.listEnd + this.listEntryEnd);
            }
        }
    };

    return new ctor();
});
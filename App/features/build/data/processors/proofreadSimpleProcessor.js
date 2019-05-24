define(function(require){
    var baseProofreadProcessor = require('features/build/data/processors/baseProofreadProcessor'),
        heroStatusEffects = require('features/constants/heroStatusEffects'),
        loadedConstants = require('features/constants/loadedConstants'),
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
                returnVal = loadedConstants.SkillsAndStats.getNameById(component.BuffTargetType);
                break;
            case "BuffA":
            case "BuffB":
            case "BuffC":
                var buff = component[property];
                if (buff.Value) {
                    buff = loadedConstants.SkillsAndStats.getNameById(buff.Target) + ' (' + buff.Value + ')';
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
    };

    ctor.prototype = Object.create(baseProofreadProcessor.prototype);
    ctor.prototype.constructor = baseProofreadProcessor;

    ctor.prototype.init = function() {
        baseProofreadProcessor.prototype.init.call(this);
        this.dataTables[this.actorFilename][""] = [];
    };

    ctor.prototype.parseActor = function(context, idMap, actor) {
        var entry = {};
        entry.left = this.parseEntryLeft(idMap, 'Actor', undefined, actor);
        entry.right  = this.parseEntryRight(idMap, undefined, actor);
        this.dataTables[this.actorFilename][""].push(entry);
    };

    ctor.prototype.parseProp = function(context, idMap, prop) {
        var sceneName = idMap[prop.sceneId];
        var sceneToPropMap = this.dataTables[this.propFilename][sceneName];
        if (null == sceneToPropMap) {
            this.dataTables[this.propFilename][sceneName] = [];
        }
        var entry = {};
        entry.left = this.parseEntryLeft(idMap, 'Prop', sceneName, prop);
        entry.right  = this.parseEntryRight(idMap, sceneName, prop);
        this.dataTables[this.propFilename][sceneName].push(entry);
    };

    ctor.prototype.getPageTitle = function(writer, filename) {
        return  (filename == this.actorFilename ? 'Actors' : (filename == this.propFilename ? "Props" : "Unknown Types")) + " for " + baseProofreadProcessor.prototype.getPageTitle.call(this);
    };

    ctor.prototype.parseEntryLeft = function(idMap, entryType, sceneName, entry) {
       return ((sceneName ? "<b>Scene</b>: " + sceneName + this.newline : "" )
                    + "<b>" + entryType + " Name</b>: " + entry.name + this.newline
                    + "<b>" + entryType + " Id</b>: " + entry.id + this.newline);
    };

    ctor.prototype.parseEntryRight = function(idMap, sceneName, entry) {
        var output = this.listStartHidden
                    + this.listEntryStart
                    + "<b>Display Name</b>: " + ( !!entry.displayName ? entry.displayName : (entry.name + ' (same as name)'))
                    + this.listEntryEnd;
        if (entry.description) {
            output += this.listEntryStart 
                    + "<b>Description</b>: " + entry.description + "\r\n"
                    + this.listEntryEnd;
        }
        if (entry.components && entry.components.length > 0) {
            output += "<hr/>\r\n";

            for (var i = 0; i < entry.components.length; i++) {
                var comp = entry.components[i];
                output += this.listEntryStart
                            + parseComponent(comp, 'type') + this.newline
                            + this.listStart;
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
                        output += this.listEntryStart + propertyName + ': ' + componentPropertyValue + this.listEntryEnd;
                    }
                }, this);
                output += this.listEnd 
                    + this.listEntryEnd;
            }
        }
        output += this.listEnd;
        return output;
    };

    return new ctor();
});
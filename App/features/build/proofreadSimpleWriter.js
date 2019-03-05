define(function(reqire){
    var baseWriter = require('features/build/baseWriter'),
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

    function _writeComponent(writer, out, comp) {
        out.push(parseComponent(comp, 'type') + writer.newline);
        ctor.writeItemListStart(out, false);
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
                ctor.writeItemStart(out);
                out.push(propertyName + ': ' + componentPropertyValue);
                ctor.writeItemEnd(out);
            }

        });
        ctor.writeItemListEnd(out);
    }

	function _writeComponents(writer, out, item) {
		for (var i = 0; i < item.components.length; i++) {
			var comp = item.components[i];
			ctor.writeItemStart(out);
			_writeComponent(writer, out, comp);
			ctor.writeItemEnd(out);
		}
	}

    function _writeDetails(writer, out, item) {
        out.push("<div class=\"right\">\r\n");
        ctor.writeItemListStart(out, true);
        ctor.writeItemStart(out);
        out.push("<b>Display Name</b>: " + ( !!item.displayName ? item.displayName : (item.name + ' (same as name)')));
        ctor.writeItemEnd(out);
        if (item.description) {
        	ctor.writeItemStart(out);
        	out.push("<b>Description</b>: " + item.description + "\r\n");
        	ctor.writeItemEnd(out);
    	}
        if (item.components && item.components.length > 0) {
            out.push("<hr/>\r\n");
        	_writeComponents(writer, out, item);
        }
        ctor.writeItemListEnd(out);
        out.push("</div>\r\n");
    }

    function _writeitems(writer, scene, items) {
        var out = [];
        for (var i = 0; i < items.length; i++) {
        		var item = items[i];
                out.push("<section>\r\n");
                out.push("<div class=\"left\">\r\n");
                out.push("<div class=\"floater\">" );
                if (scene) {
                    out.push("<b>Scene</b>: " + scene + writer.newline);
                }
                out.push("<b>" + writer.itemType + " Name</b>: " + item.name + writer.newline);
                out.push("<b>" + writer.itemType + " Id</b>: " + item.id + writer.newline);
                out.push("</div>\r\n");
                out.push("</div>\r\n");
                _writeDetails(writer, out, item);
                out.push("<div class=\"clear\"></div>\r\n");
                out.push("</section>\r\n");
        }
        writer.writeStream.write(out.join(''), this.encoding);
    }


    var ctor = function(path, type) {
        baseWriter.call(this, path);
        this.newline = "\r\n<br/>\r\n";
        this.itemType = type;
    };

    ctor.prototype = Object.create(baseWriter.prototype);
    ctor.prototype.constructor = baseWriter;

    ctor.htmlEscape = function(out, itemToWrite) {
        if (itemToWrite) {
            out.push(itemToWrite.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        }
    };

    ctor.writeItemStart = function(out) {
        out.push("<li>");
    };

    ctor.writeItemEnd = function(out) {
        out.push("</li>\r\n");
    };

    ctor.writeItemListStart = function(out, hideStyle) {
        out.push("<ul");
        if (hideStyle) {
            out.push(" class=\"hideStyle\"");
        }
        out.push(">\r\n");
    };

    ctor.writeItemListEnd = function(out) {
        out.push("</ul>\r\n");
    };

    ctor.prototype.writeHtmlHeader = function() {
        this.writeStream.write("<!DOCTYPE html>\r\n" 
            + "<html>\r\n"
            + "<head>\r\n"
            + "<meta charset=\"UTF-8\">"
            + "<title>" + (this.itemType ?  this.itemType + "s for " : "") + "Hero-U: Rogue to Redemption (Proofread)</title>\r\n"
            + "<link rel=\"stylesheet\" href=\"game_text.css\"/>\r\n"
            + "</head>\r\n" 
            + "<body>\r\n"
            + "<script src=\"jquery-1.11.3.min.js\"></script>\r\n"
            + "<script src=\"jquery.viewport.mini.js\"></script>\r\n"
            + "\r\n"
            , this.encoding);
    };

    ctor.prototype.writeHtmlFooter = function() {
        this.writeStream.write(
            "</body>\r\n</html>"
            , this.encoding);
    };

    ctor.prototype.writeData = function(scene, items) {
        if (!items) return; // ignore scenes without items
        if (!Array.isArray(items)) {
            throw new Error("proofreadWriter.writeScene() expects a " + this.itemType + " array!");
        }
        this.writeStream.write(
              "<article>\r\n", this.encoding);
        _writeitems(this, scene, items);
        this.writeStream.write(
              "</article>\r\n", this.encoding);

    };

    ctor.createFileWriter = function(path, type) {
        var writer = new ctor(path, type);
        return writer;
    };

    return ctor;
});
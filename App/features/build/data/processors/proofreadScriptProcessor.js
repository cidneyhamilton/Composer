define(function(require){
    var baseProofreadProcessor = require('features/build/data/processors/baseProofreadProcessor'),
        minigamesMap = require('features/constants/minigames'),
        emotionsMap = require('features/constants/emotions');

    function getMysteryIfNull(potentiallyNullValue) {
        return (potentiallyNullValue ? potentiallyNullValue : "???");
    }

    function getTime(days, hours, minutes) {
        return ((days ? days : '0') + ":" + (hours ? hours : '0') + ":" + (minutes ? minutes : '0'));
    }

    var ctor = function () {
        baseProofreadProcessor.call(this, 'game_text');
    };

    ctor.prototype = Object.create(baseProofreadProcessor.prototype);
    ctor.prototype.constructor = baseProofreadProcessor;

    ctor.prototype.init = function() {
        baseProofreadProcessor.prototype.init.call(this);
        this.entryLookup = {};
    };

    ctor.prototype.appendEntry = function(epMetadata, output) {
        var entryKey = epMetadata.script.id + "_" + epMetadata.entryPoint.id;
        var entry = this.entryLookup[entryKey];
        if (!entry) {
            debugger;
        }
        if (typeof output === 'string') {
            entry.right += output;
        } else {
            entry.right += output.join('');
        }
    }

    ctor.prototype.pushEntry = function(entry, epMetadata) {
        var entryKey = epMetadata.script.id + "_" + epMetadata.entryPoint.id;
        this.entryLookup[entryKey] = entry;
        this.dataTable[epMetadata.sceneName].push(entry);
    }

    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {
        // Only handle scripts with 1+ entry points
        if (script.entryPoints && script.entryPoints.length > 0) {
            // check if data already exists for this scene
            if (!this.dataTable[sceneName]) {
                this.dataTable[sceneName] = [];
            }
        }
    };

    ctor.prototype.parseEntryPoint = function(idMap, entryPoint, entryPointIndex, epMetadata) {
        if (entryPoint) { 
            var entry = {};
            entry.left = this.parseEntryLeft(idMap, epMetadata);
            entry.right = "";
            this.pushEntry(entry, epMetadata);
        }
    };

    ctor.prototype.parseNodeArray = function(idMap, nodeArray, epMetadata) {
        if (nodeArray.length > 0) {
            this.appendEntry(epMetadata, epMetadata.depth == 1 ? this.listStartHidden: this.listStart);
        }
    };

    ctor.prototype.parseNodeArrayEnd = function(idMap, nodeArray, epMetadata) {
        if (nodeArray.length > 0) {
            this.appendEntry(epMetadata, this.listEnd);
        }
    };

    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {
        var out = [];
        out.push(this.listEntryStart);

        var nodeChangeDisplayValue = ('0' == node.change ? "Remove" : "Add");
        var nodeCurrencyDisplayValue = ('1' == node.currency ? "Deeds" : '2' == node.currency ? "Demerits" : "Lyra (money)");

        switch (nodeType) {
            case 'Achievements' :
                out.push('Achievements: Award ('
                    + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'scene', node.sceneId) + "): " 
                    + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'prop', node.propId));
                break;
            case 'Add Store Stock' :
                out.push(" ");
                var stockCategory = ["None","Clothing","Goods","Special","Joel's Stash","Fester's Farrago"];
                out.push("Add Store Stock: ");
                if(node.category >= 0 && node.category < stockCategory.length) {
                    out.push(getMysteryIfNull(stockCategory[node.category])); 
                } else { 
                    out.push("(Invalid store category)"); 
                }
                out.push(" Item: ");
                out.push(getMysteryIfNull(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'prop', node.propId)));
                out.push(", qty: " + (node.qty > 1 ? "infinite" : node.qty));
                out.push(", Buy Price: " + node.buyPrice);
                out.push(", Sell Price: " + node.sellPrice);
                out.push(", Availability: " + node.availability);
                // Restock is deprecated
                //out.push(", Restock Daily: " + (node.restock ? "Yes" : "No"));
                out.push(", On Look Description: ");
                out.push(this.htmlEscape(node.onLookField));
                out.push(", On Purchase Description: ");
                out.push(this.htmlEscape(node.onLookField));
                break;
            case 'AutoSave' :
                out.push('AutoSave');
                break;
            case 'Buff Add' :
                var buffType=['None','Add Buff','Apply Resistance','Add Poison to Ego','Remove Buff','Undefined','Cure Poison'];
                var addbuffTargetData=['None','All','AllSkills','AllStats','Climbing','Combat','Defense','Listen','Tool Use','Spot','Stealth','Throwing','Agility','Charm','Fitness','Luck','Magic','Moxie','Perception','Smarts'];
                var addresistanceTargetData=['None','Poison Resistance','Magic Resistance','Poison Damage Resistance'];
                out.push("Buff Add: " + (node.buffType ? buffType[node.buffType]+" " : "") + (node.value ? node.value : "") + (node.isPercentage ? "%" : ""));
                if(node.buffType == 1 && node.targetData)
                    out.push(" to " + addbuffTargetData[node.targetData]);
                else if(node.buffType == 2 && node.targetData)
                    out.push(" to " + addresistanceTargetData[node.targetData]);
                else if(node.targetData && node.targetData > 0)
                    out.push(" (targetData: " + node.targetData + ")");
                 out.push((node.duration ? " for " + node.duration + " minutes" : "") + (node.namedSource ? " (" + node.namedSource + ")" : ""));
                break;
            case 'Change Health' :
                var healthTarget=['Stamina','Mojo','Power'];
                out.push('Change Health: ' + healthTarget[node.target] + " " + node.amount + (node.isPercentage ? "%" : "") + (node.target == 0 && node.canDie ? " (can die)" : ""));
                break;
            case 'Change Scene' :
                out.push('Change to scene: ' + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, "scene", node.sceneId) + " at location ");
                out.push(getMysteryIfNull(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, "prop", node.spawnId)));
                out.push(" (" + node.fadeTime + ")");
                break;
            case 'Change Story Event' :
                out.push("Change to story event: " + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'storyEvent', node.storyEventId));
                break;
            case 'Clear Store Stock' :
                out.push("Clear Store Stock");
                break;
            case 'Comment' :
                out.push("COMMENT (" + node.commentor + "): ");
                out.push(this.htmlEscape(node.message));
                break;
            case 'Currency' :
                out.push(nodeChangeDisplayValue + " " + node.amount + 
                    ("Add" == nodeChangeDisplayValue ? " to " : " from ") + 
                    (node.currency ? nodeCurrencyDisplayValue : "Lyra (money)"));
                break;
            case 'Cycle' :
                out.push("Cycle");
                break;
            case 'EndScript' :
                out.push('EndScript');
                break;
            case 'Fade' :
                out.push(node.scope + ":");
                if(node.scope == "FadeOut" || node.scope == "FadeOutAndIn") {
                    out.push(" Fade out time (sec): " + node.fadeTime); 
                }
                if(node.scope == "FadeOutAndIn") { 
                    out.push(", "); 
                }
                if(node.scope == "FadeIn"  || node.scope == "FadeOutAndIn") {
                    out.push(" Time Spent in Darkness (sec): " + node.fadeDown);
                    out.push(", Fade In Time (sec): " + node.fadeTime2);
                }
                if (node.wait) { 
                    out.push(" (wait for fade out)"); 
                }
                break;
            case 'Game Over' :
                if (node.title) {
                    out.push(node.title + " " + node.message);
                } else {
                    out.push("*** GAME OVER ***");
                }
                break;
            case 'Hide CloseUp' :
                out.push("Hide CloseUp");
                break;
            case 'Hide Vignette' :
                out.push("Hide Vignette");
                break;
            case 'Improve Skill' :
                out.push('Improve Skill: '+ node.skill + " " + node.amount);
                break;
            case 'Increment Time' :
                out.push('Increment time by: ' + getTime(node.days, node.hours, node.minutes));
                break;
            case 'Inventory' :
                out.push(nodeChangeDisplayValue + " " + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'prop', node.propId) + " (" + node.count + ")" + 
                    ("Add" == nodeChangeDisplayValue ? " to" : " from") + " inventory.");
                break;
            case 'Invoke Command':
                out.push('Invoke Command: (' + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, node.entityType, node.entityId) + " -> " + node.command + ')');
                if (node.parameter) {
                    out.push( " (" + node.parameter + ")");
                }
                break;
            case 'Invoke Script':
                var nodeEntryPointName;
                if (node.currentScope && node.currentScope == 'Current') {
                    var nodeEntryPointDisplayValue = idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'entryPoint', node.entryPointId);
                    nodeEntryPointName = nodeEntryPointDisplayValue ? nodeEntryPointDisplayValue : 'Unknown Entry Point ID: ' + node.entryPointId;
                }
                out.push('Invoke Script (' 
                    + (nodeEntryPointName ? 'Current: ' + nodeEntryPointName : idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'script', node.scriptId)) 
                    + ')');
                break;
            case 'Journal Entry' :
                out.push("Journal: [" + node.name + "]");
                out.push(node.isDeed ? " (Deeds List)" : "");
                out.push(this.newline);
                out.push(this.htmlEscape(node.description));
                break;
            case 'Minigame' :
                out.push("Minigame: " + minigamesMap.getMinigameById(node.minigameIndex));
                break;
            case 'Move Actor' :
                out.push("Move Actor " + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId) + " to location ");
                out.push(getMysteryIfNull(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'prop', node.propId)));
                if (node.wait) {
                    out.push(" (wait)");
                }
                break;
            case 'Place Actor' :
                out.push("Place Actor " + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId) + " at location ");
                out.push(getMysteryIfNull(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, "prop", node.spawnId)));
                break;
            case 'Play Animation' :
                out.push("Play Animation: ");
                if (node.actorId) {
                    out.push("[" + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId) + "]");
                }
                out.push(this.htmlEscape(node.animationName));
                if (node.wait) {
                    out.push (" (Wait for command completion)");
                }
                break;
            case 'Play Movie' :
                out.push("Play Movie: " + getMysteryIfNull(node.movie));
                break;
            case 'Play Music' :
                var nodeChannel = (node.channel == 1 ? 'main' : 'ambient');
                var loopType = (node.loopType == 1 ? 'play once' : 'repeat at interval');
                var musicTrack = node.musicTrack + '(' + nodeChannel + ') (' + loopType + ')';
                out.push("Play Music: " + getMysteryIfNull(musicTrack));
                break;
            case 'Play Poobah' :
                out.push("Play Poobah: Start Game Script: ");
                out.push(getMysteryIfNull(node.startGameScript));
                out.push(", End Round Script: ");
                out.push(getMysteryIfNull(node.endRoundScript));
                out.push(", End Game Script: ");
                out.push(getMysteryIfNull(node.endGameScript));

                out.push(", Player 1: ");
                out.push(getMysteryIfNull(node.playerKey1));
                out.push(", Player 2: ");
                out.push(getMysteryIfNull(node.playerKey2));
                out.push(", Player 3: ");
                out.push(getMysteryIfNull(node.playerKey3));
                out.push(", Player 4: ");
                out.push(getMysteryIfNull(node.playerKey4));
                out.push(", Player 5: ");
                out.push(getMysteryIfNull(node.playerKey5));
                out.push(", Player 6: ");
                out.push(getMysteryIfNull(node.playerKey6));
                break;
            case 'Show Prop Description' :
                out.push("Show Prop Description");
                break;
            case 'Play Sound Effect' :
                out.push("Play Sound Effect: " );
                out.push(this.htmlEscape(node.soundEffectName));
                if (node.wait) {
                    out.push (" (Wait for command completion)");
                }
                break;
            case 'Player Value' :
                out.push("Player Value: " + nodeChangeDisplayValue + " " + getMysteryIfNull(node.amount) + " " + getMysteryIfNull(nodeCurrencyDisplayValue));
                break;
            case 'Prop Status' :
                out.push("Make: " + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'prop', node.propId) + " " + node.status);
                break;
            case 'Q&A' :
                out.push(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId) + ": " + this.htmlEscape(node.text));
                break;
            case 'Quests' :
                var questOp=['Add Quest','Complete Quest','Fail Quest'];
                out.push("Quest: " + questOp[node.target] + ' "');
                out.push(getMysteryIfNull(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'prop', node.propId)));
                out.push('"');
                break;
            case 'Remove Actor' :
                out.push("Remove Actor: ");
                out.push(getMysteryIfNull(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId)));
                break;
            case 'ResetCamera' :
                out.push("Reset Camera over " + node.time + " second" + (node.time > 1 ? "s" : "") 
                    + (node.wait ? " (wait for command completion)" : ""));
                break;
            case 'Reputation' :
                out.push(nodeChangeDisplayValue + " " + node.amount 
                    + " reputation to " + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId));
                break;
            case 'Select Inventory Item' :
                out.push("Open inventory and allow player to select an item.");
                if (node.itemTypeFilter) {
                    out.push(" (" + node.itemTypeFilter + ")");
                }
                if (node.isGiftFilter) {
                    out.push(" (Gift)");
                }
                break;
            case 'Set Camera FOV' :
                out.push('Set Camera FOV ' + node.fov + (node.time ? " over " + node.time + " seconds" : "" ) 
                    + (node.wait ? " (wait for command completion)" : ""));
                break;
            case 'Set Camera Target' :
                out.push('Set Camera Target');
                if(node.propId)
                    out.push(" on prop " + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'prop', node.propId));
                else if(node.actorId)
                    out.push(" on actor " + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId));
                else
                    out.push(" on pan");
                if(node.time)
                    out.push(" for " + node.time + " seconds");
                if(node.wait)
                    out.push(" (wait for command completion)");
                break;
            case 'Set Time' :
                out.push('Set time: ' + getTime(node.day, node.hour, node.minute));
                break;
            case 'Set Timer' :
                out.push('Set timer to go off in: ' + getTime(node.days, node.hours, node.minutes));
                out.push(" - '" +  idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'script', node.scriptId) + "'");
                break;
            case 'Show Close Up' :
                out.push("Show Close Up: " );
                out.push(this.htmlEscape(node.imageName));
                break;
            case 'Show Store' :
                out.push("Show Store");
                break;
            case 'Show Vignette' :
                out.push("Show Vignette: " );
                out.push(this.htmlEscape(node.vignetteName));
                break;
            case 'Stat Branch':
                out.push(node.skill + " check vs " + node.target + this.newline);

                out.push(this.listStart);

                // This is where Success / Failure is parsed (via ParseSEction).
                // listEnd will be written in parseNodeEnd

                break;
            case 'Stop Player' :
                out.push("Stop Player");
                break;
            case 'Speak' :
                out.push(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId) + " <span style=\"font-size: small; color: green\">[" + emotionsMap.getEmotionById(node.emotion) + "]</span> ");

                if (node.device && node.device != 0) {
                    out.push(" <i>(" + emotionsMap.getDeviceById(node.device) + ")</i> ");
                }
                if (node.actorId2) {
                    out.push(" to " + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId2) + " <span style=\"font-size: small; color: green\">[" + emotionsMap.getEmotionById(node.emotion2) + "]</span> ");

                    if (node.device2 && node.device2 != 0) {
                        out.push(" <i>(" + emotionsMap.getDeviceById(node.device2) + ")</i> ");
                    }
                }
                out.push(" : " + this.htmlEscape(node.text));
                break;
            case 'Tags' :
                var scopeValue = node.scopeId ? idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, node.scope, node.scopeId) : node.scope;
                out.push('Change tags for ' + scopeValue + ": ");
                if (node.tagsToAdd) {
                    out.push(" Add Tags: [" + node.tagsToAdd + "] ");
                }
                if (node.tagsToRemove) {
                    out.push(" Remove Tags: [" + node.tagsToRemove + "] ");
                }
                if (scopeValue == 'prop' || scopeValue == 'scene'||  scopeValue == 'actor' || scopeValue == 'storyEvent') {
                    out.push(" (" + scopeValue + ")");
                }
                break;
            case 'Trace' :
                out.push("Trace: " + node.message);
                break;
            case 'Turn Actor' :
                out.push('Turn Actor "');
                out.push(getMysteryIfNull(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId)));
                out.push('" to face');
                if(node.targetActorId) { out.push(' actor:"' + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.targetActorId) + '"'); }
                if(node.propId) { out.push(' prop:"' + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'prop', node.propId) + '"'); }
                if(!node.targetActorId && !node.propId) { out.push(' ????'); }
                if (node.wait) { out.push (" (Wait for command completion)"); }
                break;
            case 'Use Item' :
                out.push("Use Item: ");
                out.push(getMysteryIfNull(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'prop', node.propId)));
                break;
            case 'Use Skill Branch':
                out.push(node.skill + " check vs " + node.target + this.newline);

                out.push(this.listStart);

                // This is where succuess / failure is parsed (via ParseSection)
                // listEnd is written in parseNodeEnd()
                break;
            case 'Variable' : 
                var scopeValue = node.scopeId ? idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, node.scope, node.scopeId) : node.scope;
                if( node.add ) { out.push('Add to variable \''); }
                else { out.push('Set variable \''); }
                out.push( node.name + "\' (" + scopeValue + " scope) ");
                if( node.add ) { out.push(" the "); }
                else { out.push(" to "); }
                out.push(node.source.getDescription());
                break;
            case 'Wait' :
                out.push("Wait for " + node.waitForSeconds + " second" + (node.waitForSeconds > 1 ? "s" : ""));
                break;
            default:
                out.push("Node: " + nodeType);
                if(node.scope) {
                    var scopeValue = node.scopeId ? idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, node.scope, node.scopeId) : node.scope;
                    out.push("  scope: " + scopeValue);
                }
                if (node.actorId) {
                    out.push("  actor: " + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId));
                }
                if (node.propId) {
                    out.push("   prop: " + idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'prop', node.propId));
                }
                if (node.text) {
                    out.push("   text: ");
                    out.push(this.htmlEscape(node.text));
                }
                // fallthrough
            case 'Branch' :
            case 'Cycle':
            case 'Menu' :
                break;
        }

        this.appendEntry(epMetadata, out);
    };

    ctor.prototype.parseNodeEnd = function(idMap, node, nodeType, nodeIndex, epMetadata) {

        var out = [];
        if ('Stat Branch' == nodeType || 'Use Skill Branch' == nodeType) {
            // Close the list opened in parseNode for the branching node types
            out.push(this.listEnd);
        }

        out.push(this.listEntryEnd);

        this.appendEntry(epMetadata, out);
    };

    ctor.prototype.parseSectionArray = function(idMap, sectionArray, epMetadata) {
        this.appendEntry(epMetadata, epMetadata.depth == 1 ? this.listStartHidden : this.listStart);
    };

    ctor.prototype.parseSectionArrayEnd = function(idMap, sectionArray, epMetadata) {
        var out = [];
        if (epMetadata.autoAddDone) {
            this.parseSection(idMap, { text: "Done <i>(Auto Added)</i>" }, sectionArray.length, epMetadata);
            this.parseSectionEnd(idMap, { text: "Done <i>(Auto Added)</i>" }, sectionArray.length, epMetadata);
        }
        out.push(this.listEnd);
        this.appendEntry(epMetadata, out);
    };

    ctor.prototype.parseSection = function(idMap, section, sectionIndex, epMetadata) {
        var out = [];
        out.push(this.listEntryStart);

        if (epMetadata.isSuccessFailure) {
            out.push(epMetadata.isSuccessFailure + ": " + this.newline);
        }

        if (section.text) {
            out.push((sectionIndex + 1) + ". " + section.text);
            if (epMetadata.unique) {
                out.push(" <i>(Unique)</i>");
            }
        }
        if (section.expression) {
            var prefix = "";
            if ("nodes.branchSection" === section.type ) {
                prefix = (sectionIndex == 0 ? "If" : "Else If");
            }
            if (prefix || "options.text" === section.type) {
                prefix += ": ";
            }
            // If we have a prefix defined (from either branchSection or text)
            if (prefix) {
                out.push(prefix + section.expression.getDescription());
            }
        } else if ("nodes.branchSection" === section.type) {
            out.push(sectionIndex == 0 ? "If: " : "Else: ");
        }

        this.appendEntry(epMetadata, out);
    };

    ctor.prototype.parseSectionEnd = function(idMap, section, sectionIndex, epMetadata) {
        var out = [];
        out.push(this.listEntryEnd);
        this.appendEntry(epMetadata, out);
    };

    ctor.prototype.writeHtmlFooter = function(writer) {
        writer.write("<script src=\"game_text.js\"></script>\r\n");
        baseProofreadProcessor.prototype.writeHtmlFooter.call(this, writer);
    };

    ctor.prototype.parseEntryLeft = function(idMap, epMetadata) {
        var output = "<b>Scene</b>: " + epMetadata.sceneName + this.newline
                    + "<b>Script</b>: " + epMetadata.script.name + this.newline;
        var out = [];
        if (epMetadata.script.storyEventId) {
            out.push("<b>During</b>: " + idMap[epMetadata.script.storyEventId] + this.newline);
        }
        if (epMetadata.script.propId) {
            out.push("<b>For</b>: " + idMap[epMetadata.script.propId] + this.newline);
        }
        if (epMetadata.script.actorId) {
            out.push("<b>For</b>: " + idMap[epMetadata.script.actorId] + this.newline);
        }
        if (epMetadata.script.trigger) {
            out.push("<b>On</b>: " + epMetadata.script.trigger.name + this.newline);
        }
        output += out.join('')
                + "<b>EntryPoint</b>: " + epMetadata.entryPoint.name + this.newline
                + "<b>Script Id</b>: " + epMetadata.script.id + this.newline;
        return output;
    };

    return new ctor();
});

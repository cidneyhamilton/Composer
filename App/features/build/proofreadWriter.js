define(function(reqire){
    var baseWriter = require('features/build/proofreadSimpleWriter');

    function SectionAtts(layer, unique, autoAddDone) {
        var sectionAtts = {};
        sectionAtts.layer = layer;
        sectionAtts.unique = unique;
        sectionAtts.autoAddDone = autoAddDone;
        return sectionAtts
    }

    function _writeSection(writer, out, index, section, sectionAtts) {
        if (section.text) {
            out.push((index + 1) + ". " + section.text);
            if (sectionAtts.unique) {
                out.push(" <i>(Unique)</i>");
            }
        }
        if (section.expression) {
            var prefix = "";
            if ("nodes.branchSection" === section.type ) {
                prefix = (index == 0 ? "If" : "Else If");
            }
            if (prefix || "options.text" === section.type) {
                prefix += ": ";
            }
            // If we have a prefix defined (from either branchSection or text)
            if (prefix) {
                out.push(prefix + section.expression);
            }
        } else if ("nodes.branchSection" === section.type) {
            out.push(index == 0 ? "If: " : "Else: ");
        }
        if (section.nodes) {
            sectionAtts.layer++;
            _writeNodesArr(writer, out, section.nodes, sectionAtts);
        }
    }

    function _writeSectionArr(writer, out, sectionArr, sectionAtts) {
        baseWriter.writeItemListStart(out, sectionAtts.layer == 1);
        for (var i = 0; i < sectionArr.length; i++) {
            baseWriter.writeItemStart(out);
            _writeSection(writer, out, i, sectionArr[i], sectionAtts);
            baseWriter.writeItemEnd(out);
        }
        if (sectionAtts.autoAddDone) {
            baseWriter.writeItemStart(out);
            _writeSection(writer, out, sectionArr.length, { text: "Done <i>(Auto Added)</i>" }, new SectionAtts(sectionAtts.layer));
            baseWriter.writeItemEnd(out);
        }
        baseWriter.writeItemListEnd(out);
    }

    function _writeTime(out, days, hours, minutes) {
        out.push((days ? days : '0'));
        out.push(":" + (hours ? hours : '0'));
        out.push(":" + (minutes ? minutes : '0'));
    }

    function _writeMysteriousIfNull(out, potentiallyNullValue) {
        out.push((potentiallyNullValue ? potentiallyNullValue : "???"));
    }

    function _writeNode(writer, out, index, node, sectionAtts) {
        var nodeTopLevel = (node.desc || node.type);

		// To show all node values for an item: Object.keys(node).forEach(function (key) { out.push("(" + key + ":" + node[key] + ")"); });
		// To pass through any missing ones, add them to internalDoc.js:processSingleNode()
        switch (nodeTopLevel) {
            case 'Achievements' :
                out.push('Achievements: Award ('+ node.scene + "): " + node.prop);
                break;
            case 'Add Store Stock' :
            	out.push(" ");
            	var stockCategory = ["None","Clothing","Goods","Special","Joel's Stash","Fester's Farrago"];
                out.push("Add Store Stock: ");
                if(node.category >= 0 && node.category < stockCategory.length) { _writeMysteriousIfNull(out, stockCategory[node.category]); }
                else { out.push("(Invalid store category)"); }
                out.push(" Item: ");
            	_writeMysteriousIfNull(out, node.prop);
            	out.push(", qty: " + (node.qty > 1 ? "infinite" : node.qty));
            	out.push(", Buy Price: " + node.buyPrice);
            	out.push(", Sell Price: " + node.sellPrice);
            	out.push(", Availability: " + node.availability);
                // Restock is deprecated
            	//out.push(", Restock Daily: " + (node.restock ? "Yes" : "No"));
            	out.push(", On Look Description: ");
            	baseWriter.htmlEscape(out, node.onLookField);
            	out.push(", On Purchase Description: ");
            	baseWriter.htmlEscape(out, node.onLookField);
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
                out.push('Change to scene: ' + node.scene + " at location ");
                _writeMysteriousIfNull(out, node.spawn);
                out.push(" (" + node.fadeTime + ")");
                break;
            case 'Change Story Event' :
                out.push("Change to story event: " + node.storyEvent);
                break;
            case 'Clear Store Stock' :
                out.push("Clear Store Stock");
                break;
            case 'Comment' :
                out.push("COMMENT (" + node.commentor + "): ");
                baseWriter.htmlEscape(out, node.message);
                break;
            case 'Currency' :
                out.push(node.change + " " + node.amount + 
                    ("Add" == node.change ? " to " : " from ") + 
                    (node.currency ? node.currency : "Lyra (money)"));
                break;
            case 'Cycle' :
                out.push("Cycle");
                break;
            case 'EndScript' :
                out.push('EndScript');
                break;
            case 'Fade' :
                out.push(node.scope + ":");
                if(node.scope == "FadeOut" || node.scope == "FadeOutAndIn") { out.push(" Fade out time (sec): " + node.fadeTime); }
                if(node.scope == "FadeOutAndIn") { out.push(", "); }
            	if(node.scope == "FadeIn"  || node.scope == "FadeOutAndIn") {
            		out.push(" Time Spent in Darkness (sec): " + node.fadeDown);
        			out.push(", Fade In Time (sec): " + node.fadeTime2);
            	}
                if (node.wait) { out.push(" (wait for fade out)"); }
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
                out.push('Increment time by: ');
                _writeTime(out, node.days, node.hours, node.minutes);
                break;
            case 'Inventory' :
                out.push(node.change + " " + node.prop + " (" + node.count + ")" + 
                    ("Add" == node.change ? " to" : " from") + " inventory.");
                break;
            case 'Invoke Command':
                out.push('Invoke Command: (' + node.entity + " -> " + node.command + ')');
                if (node.parameter) {
                    out.push( " (" + node.parameter + ")");
                }
                break;
            case 'Invoke Script':
                out.push('Invoke Script (' + (node.entryPoint ? 'Current: ' + node.entryPoint : node.script) + ')');
                break;
            case 'Journal Entry' :
                out.push("Journal: [" + node.name + "]");
                out.push(node.isDeed ? " (Deeds List)" : "");
                out.push(writer.newline);
                baseWriter.htmlEscape(out, node.description);
                break;
            case 'Minigame' :
                out.push("Minigame: " + node.minigame);
                break;
            case 'Move Actor' :
                out.push("Move Actor " + node.actor + " to location ");
                _writeMysteriousIfNull(out, node.prop);
                if (node.wait) {
                    out.push(" (wait)");
                }
                break;
            case 'Place Actor' :
                out.push("Place Actor " + node.actor + " at location ");
                _writeMysteriousIfNull(out, node.spawn);
                break;
            case 'Play Animation' :
                out.push("Play Animation: ");
                if (node.actor) {
                    out.push("[" + node.actor + "]");
                }
                baseWriter.htmlEscape(out, node.animationName);
                if (node.wait) {
                    out.push (" (Wait for command completion)");
                }
                break;
            case 'Play Movie' :
                out.push("Play Movie: ");
                _writeMysteriousIfNull(out, node.movie);
                break;
            case 'Play Music' :
                out.push("Play Music: ");
                _writeMysteriousIfNull(out, node.musicTrack);
                break;
            case 'Play Poobah' :
            	out.push("Play Poobah: ");
            	out.push("Start Game Script: ");
            	_writeMysteriousIfNull(out, node.startGameScript);
            	out.push(", End Round Script: ");
            	_writeMysteriousIfNull(out, node.endRoundScript);
            	out.push(", End Game Script: ");
            	_writeMysteriousIfNull(out, node.endGameScript);

            	out.push(", Player 1: ");
            	_writeMysteriousIfNull(out, node.playerKey1);
            	out.push(", Player 2: ");
            	_writeMysteriousIfNull(out, node.playerKey2);
            	out.push(", Player 3: ");
            	_writeMysteriousIfNull(out, node.playerKey3);
            	out.push(", Player 4: ");
            	_writeMysteriousIfNull(out, node.playerKey4);
            	out.push(", Player 5: ");
            	_writeMysteriousIfNull(out, node.playerKey5);
            	out.push(", Player 6: ");
            	_writeMysteriousIfNull(out, node.playerKey6);
            	break;
            case 'Show Prop Description' :
                out.push("Show Prop Description");
                break;
            case 'Play Sound Effect' :
                out.push("Play Sound Effect: " );
                baseWriter.htmlEscape(out, node.soundEffectName);
                if (node.wait) {
                    out.push (" (Wait for command completion)");
                }
                break;
            case 'Player Value' :
                out.push("Player Value: " + node.change + " ");
				_writeMysteriousIfNull(out, node.amount);
				out.push(" ");
				_writeMysteriousIfNull(out, node.currency);
                break;
            case 'Prop Status' :
                out.push("Make: " + node.prop + " " + node.status);
                break;
            case 'Q&A' :
                out.push(node.actor + ": ");
                baseWriter.htmlEscape(out, node.text);
                break;
            case 'Quests' :
            	var questOp=['Add Quest','Complete Quest','Fail Quest'];
            	out.push("Quest: " + questOp[node.target] + ' "');
            	_writeMysteriousIfNull(out, node.prop);
            	out.push('"');
            	break;
            case 'Remove Actor' :
                out.push("Remove Actor: ");
                _writeMysteriousIfNull(out, node.actor);
                break;
            case 'ResetCamera' :
                out.push("Reset Camera over " + node.time + " second" + (node.time > 1 ? "s" : "") + (node.wait ? " (wait for command completion)" : ""));
                break;
            case 'Reputation' :
                out.push(node.change + " " + node.amount + " reputation to " + node.actor);
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
                out.push('Set Camera FOV ' + node.fov + (node.time ? " over " + node.time + " seconds" : "" ) + (node.wait ? " (wait for command completion)" : ""));
                break;
            case 'Set Camera Target' :
                out.push('Set Camera Target');
                if(node.prop)
                    out.push(" on prop " + node.prop);
                else if(node.actor)
                    out.push(" on actor " + node.actor);
                else
                    out.push(" on pan");
                if(node.time)
                    out.push(" for " + node.time + " seconds");
                if(node.wait)
                    out.push(" (wait for command completion)");
                break;
            case 'Set Time' :
                out.push('Set time: ');
                _writeTime(out, node.day, node.hour, node.minute);
                break;
            case 'Set Timer' :
                out.push('Set timer to go off in: ');
                _writeTime(out, node.days, node.hours, node.minutes);
                out.push(" - '" + node.script + "'");
                break;
            case 'Show Close Up' :
                out.push("Show Close Up: " );
                baseWriter.htmlEscape(out, node.imageName);
                break;
            case 'Show Store' :
                out.push("Show Store");
                break;
            case 'Show Vignette' :
                out.push("Show Vignette: " );
                baseWriter.htmlEscape(out, node.vignetteName);
                break;
            case 'Stat Branch':
                out.push(node.skill + " check vs " + node.target + writer.newline);

                baseWriter.writeItemListStart(out);
                baseWriter.writeItemStart(out);
                out.push("Success: " + writer.newline);

                _writeSection(writer, out, 0, node.success, new SectionAtts(sectionAtts.layer + 1));
                baseWriter.writeItemEnd(out);

                baseWriter.writeItemStart(out);
                out.push("Failure: " + writer.newline);
                _writeSection(writer, out, 0, node.failure, new SectionAtts(sectionAtts.layer + 1));
                baseWriter.writeItemEnd(out);
                baseWriter.writeItemListEnd(out);
                break;
            case 'Stop Player' :
                out.push("Stop Player");
                break;
            case 'Speak' :
                out.push(node.actor + " <span style=\"font-size: small; color: green\">[" + node.emotion + "]</span> ");

                if (node.device) {
                    out.push(" <i>(" + node.device + ")</i> ");
                }
                if (node.actor2) {
                    out.push(" to " + node.actor2 + " <span style=\"font-size: small; color: green\">[" + node.emotion2 + "]</span> ");

                    if (node.device2) {
                        out.push(" <i>(" + node.device2 + ")</i> ");
                    }
                }
                out.push(" : ");
                baseWriter.htmlEscape(out, node.text);
                break;
            case 'Tags' :
                out.push('Change tags for ' + node.scope + ": ");
                if (node.tagsToAdd) {
                    out.push(" Add Tags: [" + node.tagsToAdd + "] ");
                }
                if (node.tagsToRemove) {
                    out.push(" Remove Tags: [" + node.tagsToRemove + "] ");
                }
                if (node.scope == 'prop' || node.scope == 'scene'||  node.scope == 'actor' || node.scope == 'storyEvent') {
                    out.push(" (" + node.scope + ")");
                }
                break;
            case 'Trace' :
                out.push("Trace: " + node.message);
                break;
            case 'Turn Actor' :
                out.push('Turn Actor "');
				_writeMysteriousIfNull(out, node.actor);
				out.push('" to face');
				if(node.targetActor) { out.push(' actor:"' + node.targetActor + '"'); }
				if(node.prop) { out.push(' prop:"' + node.prop + '"'); }
				if(!node.targetActor && !node.prop) { out.push(' ????'); }
                if (node.wait) { out.push (" (Wait for command completion)"); }
                break;
            case 'Use Item' :
                out.push("Use Item: ");
                _writeMysteriousIfNull(out, node.prop);
                break;
            case 'Use Skill Branch':
                out.push(node.skill + " check vs " + node.target + writer.newline);

                baseWriter.writeItemListStart(out);
                baseWriter.writeItemStart(out);
                out.push("Success: " + writer.newline);
                _writeSection(writer, out, 0, node.success, new SectionAtts(sectionAtts.layer + 1));
                baseWriter.writeItemEnd(out);

                baseWriter.writeItemStart(out);
                out.push("Failure: " + writer.newline);
                _writeSection(writer, out, 0, node.failure, new SectionAtts(sectionAtts.layer + 1));
                baseWriter.writeItemEnd(out);
                baseWriter.writeItemListEnd(out);
                break;
            case 'Variable' :
				if( node.add ) { out.push('Add to variable \''); }
				else { out.push('Set variable \''); }
                out.push( node.name + "\' (" + node.scope + " scope) ");
				if( node.add ) { out.push(" the "); }
				else { out.push(" to "); }
				out.push(node.source);
                break;
            case 'Wait' :
                out.push("Wait for " + node.waitForSeconds + " second" + (node.waitForSeconds > 1 ? "s" : ""));
                break;
            default:
                out.push("Node: " + (node.desc || node.type));
                if(node.scope) {
                    out.push("  scope: " + node.scope);
                }
                if (node.actor) {
                    out.push("  actor: " + node.actor);
                }
                if (node.prop) {
                    out.push("   prop: " + node.prop);
                }
                if (node.text) {
                    out.push("   text: ");
                    baseWriter.htmlEscape(out, node.text);
                }
                // fallthrough
            case 'Branch' :
            case 'Cycle':
            case 'Menu' :
                break;
        }
        if (node.nodes && node.nodes.length > 0) {
            _writeNodesArr(writer, out, node.nodes, new SectionAtts(sectionAtts.layer + 1));
        }

        if (node.sections && node.sections.length > 0) {
            _writeSectionArr(writer, out, node.sections, new SectionAtts(sectionAtts.layer, node.Unique, node.AutoAddDone));
        }

    }

    function _writeNodesArr(writer, out, nodesArr, sectionAtts) {
        baseWriter.writeItemListStart(out, sectionAtts.layer == 1);
        for (var i = 0; i < nodesArr.length; i++) {
            baseWriter.writeItemStart(out);
            _writeNode(writer, out, i, nodesArr[i], sectionAtts);
            baseWriter.writeItemEnd(out);
        }
        baseWriter.writeItemListEnd(out);
    }

    function _writeEntryPoint(writer, out, entryPoint) {
        if (entryPoint.nodes) {
            out.push("<div class=\"right\">\r\n");
            _writeNodesArr(writer, out, entryPoint.nodes, 1);
            out.push("</div>\r\n");
        }
    }

    function _writeScript(writer, out, scene, script) {   

        if (script.entryPoints) {
            for (var i = 0; i < script.entryPoints.length; i++) { 
                out.push("<section>\r\n");
                out.push("<div class=\"left\">\r\n");
                out.push("<div class=\"floater\">" );
                out.push("<b>Scene</b>: " + scene + writer.newline);
                out.push("<b>Script</b>: " + script.name + writer.newline);
                if (script.storyEvent) {
                    out.push("<b>During</b>: " + script.storyEvent + writer.newline);
                }
                if (script.prop) {
                    out.push("<b>For</b>: " + script.prop + writer.newline);
                }
                if (script.actor) {
                    out.push("<b>For</b>: " + script.actor + writer.newline);
                }
                if (script.trigger) {
                    out.push("<b>On</b>: " + script.trigger + writer.newline);
                }
                out.push("<b>EntryPoint</b>: " + script.entryPoints[i].name + writer.newline);
                out.push("<b>Script Id</b>: " + script.id + writer.newline);
                out.push("</div>\r\n");
                out.push("</div>\r\n");
                _writeEntryPoint(writer, out, script.entryPoints[i]);
                out.push("<div class=\"clear\"></div>\r\n");
                out.push("</section>\r\n");
            }
        } 
    }

    function _writeScripts(writer, scene, scripts) {
        var out = [];
        for (var i = 0; i < scripts.length; i++) {
            _writeScript(writer, out, scene, scripts[i]);
        }
        writer.writeStream.write(out.join(''), this.encoding);
    }

    var ctor = function(path) {
        baseWriter.call(this, path);
    };

    ctor.prototype = Object.create(baseWriter.prototype);
    ctor.prototype.constructor = baseWriter;

    ctor.prototype.writeHtmlFooter = function() {
        this.writeStream.write(
            "<script src=\"game_text.js\"></script>\r\n"
            + "</body>\r\n</html>"
            , this.encoding);
    };

    ctor.prototype.writeData = function(scene, scripts) {
        if (!scripts) return; // ignore scenes without scripts
        if (!Array.isArray(scripts)) {
            throw new Error("proofreadWriter.writeScene() expects a scripts array!");
        }
        this.writeStream.write(
              "<article>\r\n", this.encoding);
        _writeScripts(this, scene, scripts);
        this.writeStream.write(
              "</article>\r\n", this.encoding);

    };

    ctor.createFileWriter = function(path) {
        var writer = new ctor(path);
        return writer;
    };

    return ctor;
});
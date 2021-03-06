// Generate .ink scripts within Composer
// See https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md for documentation on syntax

define(function(require){
    
    // Initialize dependencies
    var baseProcessor = require('features/build/data/processors/baseProcessor'), 
        baseWriter = require('features/build/baseWriter'),
        db = require('infrastructure/assetDatabase'),
        emotionsMap = require('features/constants/emotions'),
	fileSystem = require('infrastructure/fileSystem'),
        loadedConstants = require('features/constants/loadedConstants'),
	path = requireNode('path'),
        serializer = require('plugins/serializer'),
        system = require('durandal/system');

    // Courtesy of https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
    // First, checks if it isn't implemented yet.
    if (!String.prototype.format) {
	String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) { 
		return typeof args[number] != 'undefined'
		    ? args[number]
		    : match
		;
            });
	};
    }

    // Returns true if the given text string is not empty, false if empty
    function isNotEmpty(someText) {
        return someText && null != someText && someText.length > 0;
    }

    // Append potentiallyAppend to original string if not empty
    function appendIfNotEmpty(origVal, potentiallyAppend) {
        return (isNotEmpty(potentiallyAppend) ? (origVal + potentiallyAppend) : origVal);
    }

    // Add potentialValue to a list if it's not null
    function addToArray(list, potentialValue) {
        if (list && isNotEmpty(potentialValue) && list.indexOf(potentialValue) == -1) {
            list.push(potentialValue);
        }
    }

    // Strip special characters from Composer input
    function removeSpecialCharacters(text) {
	if (text && text != null) {
	    text = text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
	}
	return text;
    }

    // Remove the whitespace from a string
    function removeWhitespace(text) {
        if(text && null != text) {
            return text.replace(/\s/g,'');
        }
        return text;
    }

    // Start with an indent of depth
    function indent(depth) {
        var result = '\n';
        for (var i = 1; i < depth; i++) {
            result += "    ";
        }
        return result;
    }

    var ctor = function () {
        baseProcessor.call(this);
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.init = function() {
        this.data = {};

	// Composer data types; props, scenes, and actors
	this.data.props = {};
        this.data.scenes = {};
	this.data.actors = {};
		
        this.inkNameLookup = {};
        this.idToInkNameMap = {};
        this.entryPoints = {};

	// Tags, variables, and constants used within ink
        this.tagList = [];
        this.varList = [];
        this.constList = [];
        this.invList = [];

	// Used for menus within ink
        this.menuList = [];
    };

    // Get the ink name of an asset
    ctor.prototype.getInkName = function(asset) {
        if (typeof asset === 'string') {
            if (!this.inkNameLookup[asset]) {
                return "ERROR_UNKNOWN_NAME_" + asset;
                // TODO Cidney: if the asset name is not registered at access time,
                // there may be an error in the script
            } else {
                return this.inkNameLookup[asset];
            }
        } else {
            if (!this.inkNameLookup[asset.name]) {
                var strippedName = removeWhitespace(asset.name);
                this.inkNameLookup[asset.name] = strippedName;
            }
            if (!this.idToInkNameMap[asset.id]) {
                this.idToInkNameMap[asset.id] = this.inkNameLookup[asset.name];
            }
            return this.inkNameLookup[asset.name];
        }
    };

    ctor.prototype.getInkNameFromId = function(assetId) {
        var assetName = this.idToInkNameMap[assetId];
        if (!assetName) {
            debugger;
            return "ERROR_UNKNOWN_ID_" + assetId;
        }
        return assetName;
    };

    
    // Get the name of the knot to jump to in an invoke script node
    ctor.prototype.getKnotName = function(node, currentScope) {
        var knotName, stitch;
        
        if (node.currentScope == "Current") {
	    // If the script is in the current scope, use entry points
	    stitch = this.entryPoints[node.entryPointId].replace(/\s+/g, '');
            if (stitch == null) {
		// otherwise, default to Main
                stitch = "Main";
            }
            return stitch;
        } else {
	    // TODO: Validation to make sure this is a valid script?
	    knotName = this.getKnotNameFromScriptId(node.scriptId);			
            return knotName;
        }
    }
    
    ctor.prototype.getKnotNameFromScriptId = function(scriptId) {
        // Get the name of the knot when passed in a script

        // TODO: Map these to something more human readable/unique?
        
        if (!this.idToInkNameMap[scriptId]) {
            // Strip hyphens from output
            return scriptId.replace(/-/g,"_");
        } else {
            return this.idToInkNameMap[scriptId];
        }
    };
    
    ctor.prototype.appendOutput = function(epMetadata, output) {
        if (isNotEmpty(output)) {
	    var scriptName = this.getKnotNameFromScript(epMetadata.script);	    
	    var sceneId = epMetadata.script.sceneId;
	    var propId = epMetadata.script.propId;
	    
	    if (sceneId != null) {
		// This script is attached to a scene
		var sceneName = this.getInkNameFromId(sceneId);				
		var scene = this.data.scenes[sceneName];
		this.data.scenes[sceneName].scripts[scriptName] += output;
	    } else {
		// This script is not attached to a scene; check propId
		var prop = this.data.props[propId];
		if (prop != null) {
		    this.data.props[propId].scripts[scriptName] += output;
		}
	    }             
        }
    };
    
    // Handle Tag Changing
    ctor.prototype.parseNodeChangeTags = function(idMap, node, epMetadata) {
	var $that = this;
	var helper = function(idMap, tagList, prefix, depth) {
            var result = "";
            if (isNotEmpty(tagList)) {
		tagList = tagList.toLowerCase();
		result += indent(depth);
		var tags = tagList.split(",");		
		// Go through the list of tags and add or remove each separately
		for (var i = 0; i < tags.length; i++) {
		    result += "\n{0} {1}".format(prefix, removeSpecialCharacters(removeWhitespace(tags[i])));
		}
		
		$that.appendTagList(tagList);
            }
            return result;
	};
	
        if (node.tagsToAdd) {
            return appendIfNotEmpty("", helper(idMap, node.tagsToAdd, "~ Tags +=", epMetadata.depth));
        } else if (node.tagsToRemove) {
            return appendIfNotEmpty("", helper(idMap, node.tagsToRemove, "~ Tags -=", epMetadata.depth));
        } else {
	    // Unclear value; do nothing
	    return "";
	}
    };

    // Handle Invoke Scripts
    ctor.prototype.parseNodeInvokeScript = function(idMap, node, epMetadata) {
        
        // Add introductory white space
        var result = indent(epMetadata.depth);

        var knotName = this.getKnotName(node);
        result += "-> {0} ->".format(knotName);

        return result;
    };

    // Handle Quiz nodes
    ctor.prototype.parseNodeQuestionAndAnswer = function(idMap, node, epMetadata) {
	var options = node.options;
	
	var result = indent(epMetadata.depth);	
	result += "Quiz: {0}: {1}".format(node.header, node.text);	
	epMetadata.depth++;
	
	if (options) {
	    for (var i = 0; i < options.length; i++) {
		result += this.parseOption(idMap, options[i], epMetadata);
	    }
	}

	result += indent(epMetadata.depth) + "-";	
	epMetadata.depth--;
	
	return result;
    };
        
    // Handle setting variables
    ctor.prototype.parseNodeSetVariable = function(idMap, node, epMetadata) {
        var result = indent(epMetadata.depth);	
	var varName = node.name.toLowerCase();
	
        if (node.add) {
            // TODO: Implement for values and ranges of values
            result += "~ {0} += {1}".format(varName, node.source.value);
        } else {
            // TODO: Implement for values and ranges of values
            result += "~ {0} = {1}".format(varName, node.source.value);
        }
	
        this.appendVarList(varName);
        return result;
    };

    // Show store node.
    ctor.prototype.parseNodeShowStore = function(idMap, node, epMetadata) {
	var result = indent(epMetadata.depth);
	result += ">>> SHOWSTORE";	
	return result;
    };
    
    // Handle Show Menu nodes
    ctor.prototype.parseNodeShowMenu = function(idMap, node, epMetadata) {
        var options = node.options;

        // TODO: Make sure these are unique!
        var optionsName = "opts";
        var loopName = "loop";
        var doneLabel = "done";
	
	// TODO: Localize these labels
	var doneText = epMetadata.script.trigger.type == "triggers.map" ? "Return to Map" : "Done";
	
        var autoAddDone = !!node.AutoAddDone;

        // TODO: unique is not used??
        var loop = !node.Unique;

        var result = "";
        result = indent(epMetadata.depth) + "- ({0})".format(optionsName);

        epMetadata.depth++;
        if (options) {
            for (var i = 0; i < options.length; i++) {
                result += this.parseOption(idMap, options[i], epMetadata);
            }
        }	
        epMetadata.depth--;

        if (autoAddDone) {
            result += (indent(epMetadata.depth+1) + "+    {0} -> {1}".format(doneText, doneLabel));
        }

        // Loop to the top if this is not unique
        if (loop) {
            result += indent(epMetadata.depth) + "- ({0})".format(loopName);
            if (options) {
                result += indent(epMetadata.depth + 1);
                result += "\{& -> {0}\}".format(optionsName);
            }
        }

        result += indent(epMetadata.depth) + "- ({0})".format(doneLabel);

	// If this is a custom trigger, DONE should take you back to the main menu
	// TODO: Hack
	// TODO: Remove if more complex behavior is desired
	var trigger = epMetadata.script.trigger.type;
	if (["triggers.map"].indexOf(trigger) > -1) {
	    result += indent(epMetadata.depth+1) + "-> DONE";
	}
        return result;
    };

    // Handle Options in Menu nodes
    ctor.prototype.parseOption = function(idMap, node, epMetadata) {
        var result = "";

        var alwaysShow = !!node.ignoreChildAvailability;
        var expression = node.expression;
        var exitMenu = node.ExitMenu;

        result += indent(epMetadata.depth);

        node.processed = true;

        if (alwaysShow) {
            result += "+   ";
        } else {
            result += "*   ";
        }
	
        if (expression) {
            result += "{ {0} } ".format(this.parseExpression(idMap, expression));
        }
        if (node.text) {
            result += "{0}".format(node.text);
        }
        
        epMetadata.depth++;
        result += this.parseChildren(idMap, node.nodes, epMetadata);
        epMetadata.depth--;

        // Exit the menu immediately after its children are displayed
        if (exitMenu) {
            result += indent(epMetadata.depth+1);
            result += "-> done";
        }

        return result;
    };

    // Handle Speak nodes
    ctor.prototype.parseNodeSpeak = function(idMap, node, depth) {
        var result = indent(depth);

        var speaker = node.actorId;
        speaker = (speaker == null ? "" : idMap[speaker]);

        // Is there a listener?
        var listener = node.actorId2;
        listener = (listener == null ? "" : idMap[listener]);

        // Tag the speak node with an emotion.
        var tagString = "";
	var emotion = emotionsMap.getEmotionById(node.emotion);
	var emotion2 = emotionsMap.getEmotionById(node.emotion2);
	
        if (node.emotion != 0 && listener != "" && node.emotion2 != 0) {
	    // If both the speaker and the listener have emotions, tag both
            tagString += "# {0} # {1} ".format(emotion, emotion2);
        } else if (node.emotion != 0) {
	    // Tag the speaker with a default emotion
            tagString += "# {0} # neutral".format(emotion);
        } else if (listener != "" && node.emotion2 != 0) {
	    // Tag the listener with a default emotion
            tagString += "# neutral # {0} ".format(emotion2);
        }

	if (node.voiceClip != null) {
	    tagString += "# {0}".format(node.voiceClip);
	}
	
        result += "{0}: {1} {2}".format(speaker, node.text, tagString);
        return result;
    };

    // Handle Branching
    ctor.prototype.parseNodeBranch = function(idMap, node, depth, epMetadata) {
        var result = "";
        if (node.sections && node.sections.length > 0) {
            for (var i = 0; i < node.sections.length; i++) {
		// Go through each section and parse each branch node
                var s = this.parseNodeBranchSection(idMap, node.sections[i], depth + 1, epMetadata);
                if (isNotEmpty(s)) {
                    result += indent(depth + 1) + "- {0}".format(s);
                }
            }
        }

        if (isNotEmpty(result)) {
            result = indent(depth) + "{" + result + indent(depth) + "}";
        }
        return result;
    };

    // Handle Branch Sections
    ctor.prototype.parseNodeBranchSection = function(idMap, section, depth, epMetadata) {
        var expression = section["expression"];
        var result = "";

        epMetadata.depth++;
        var children = this.parseChildren(idMap, section["nodes"], epMetadata);
        if (expression) {
            result += "{0}:".format(this.parseExpression(idMap, expression));
            result += children;
        } else {
            // this is just a block of nodes; no expression to evaluate
            if (isNotEmpty(children)) {
                result += "else: {0}".format(children);
            }
        }

        epMetadata.depth--;

        return result;
    };


    // Handle Expressions in Branches
    ctor.prototype.parseExpression = function(idMap, node) {
        var left = node.left;
        var right = node.right;
        var tags = node.tags;
        if (tags !== undefined) {
            tags = removeSpecialCharacters(tags.toLowerCase());
        }
        var has = node.has;
        var prop = node.propId;
		
        var result = "";
		
        switch(node.type) {
        case "expressions.variableComparison":
            var operatorVal, varName, constName;
            switch(node.operator) {
            case "lt":
                operatorVal = "<";
                break;
            case "lte":
                operatorVal = "<=";
                break;
            case "gt":
                operatorVal = ">";
                break;
            case "gte":
                operatorVal = ">=";
                break;
            case "eq":
                operatorVal = "==";
                break;
            case "ne":
                operatorVal = "!=";
                break;
            }
            varName = removeWhitespace(node.variableName.toLowerCase());
            this.appendVarList(varName.toLowerCase());
            constName = removeWhitespace(node.compareTo);
            this.appendConstList(constName);
            result += "{0} {1} {2}".format(varName, operatorVal, constName);
            break;
        case "expressions.or":
            result += "{0} {1} {2}".format(this.parseExpression(idMap, left), "||", this.parseExpression(idMap, right));
            break;
        case "expressions.and":
            result += "{0} {1} {2}".format(this.parseExpression(idMap, left), "&&", this.parseExpression(idMap, right));
            break;
        case "expressions.inInventory":
            prop = this.getInkNameFromId[prop];
            addToArray(this.invList, prop);
            if (has) {
                result += "Inventory has {0}".format(prop);
            } else {
                result += "Inventory has ({0})".format(prop);
            }
            break;
        case "expressions.inTags":
            this.appendTagList(tags);
            if (has) {
                result += "Tags ? {0}".format(tags);
            } else {
                result += "Tags !? {0}".format(tags);
            }
            break;
        case "expressions.skillCheck":
	    result += "SkillCheck({0}, {1})".format(node.skill, node.target);
            break;
	case "expressions.currencyCheck":
	    result += "CheckCurrency({0}, {1})".format(node.currency, node.target);
	    break;
	case "expressions.currentScene":
	    var sceneName = this.getInkNameFromId(node.sceneId);
	    result += "CheckCurrentScene({0})".format(sceneName);
	    break;
        case "expressions.reputationComparison":
	    var actorName = idMap[node.actorId] + "Reputation";
	    var target = node.value;
	    
	    // TODO: Can operator be passed to ink in a more streamlined manner?
	    if (node.operator == "eq") {
		result += "CheckReputationEquals({0}, {1})".format(actorName, target);
	    } else if (node.operator == "gte") {
		result += "CheckReputation({0}, {1})".format(actorName, target);
	    } else if (node.operator == "gt") {
		result += "CheckReputation({0}, {1})".format(actorName, target + 1);
	    } else if (node.operator == "lte") {
		result += "CheckReputationLTE({0}, {1})".format(actorName, target);
	    } else if (node.operator == "lte") {
		result += "CheckReputationLTE({0}, {1})".format(actorName, target + 1);
	    } else if (node.operator == "not") {
		result += "CheckReputationNot({0}, {1})".format(actorName, target + 1);
	    } else {
		// Unknown comparison operator
		debugger;
	    }
            break;
        case "expressions.previousScene":
            // TODO: Implement Previous Scene
            result += "true";
            break;
        case "expressions.isPoisoned":
            // TODO: Implement IsPoisoned
            result += "false";
            break;
        case "expressions.propStatus":
            // TODO: Implement Prop Status
            result += "true";
            break;
        case "expressions.debugOnly":
            // TODO: Implement Debug Only
            result += "IsDebug";
            break;
        case "expressions.demoOnly":
            // Check to see if this is the Demo
            result += "IsDemo";
            break;
        case "expressions.actorPresent":
            // TODO: Implement Actor Present
            result += "true";
            break;
        case "expressions.isEquipped":
            // TODO: Implement Is Equipped
            result += "true";
            break;
        case "expressions.hasActiveQuest":
            // TODO: Implement Has Active Quest
            result += "true";
            break;
        case "expressions.enteredScene":
            // TODO: Implement Entered Scene
            result += "true";
            break;
        default:
            result += "ERROR_NOT_IMPLEMENTED_" + node.type;
            break;
        }
        return result;
    };

    // Handle Composer-side comments
    ctor.prototype.parseComment = function(idMap, node, depth) {
        var result = indent(depth);
        result += "// {0}".format(node.message);
        return result;
    };

    // Handle Cycle nodes
    ctor.prototype.parseCycle = function(idMap, node, depth, epMetaData) {
        var result, i, nodes, children;
        result = indent(depth);
        children = "";

        // Open cycle
        result += "\{&";

        nodes = node.nodes;

        for (var i = 0; i < nodes.length; i ++) {
            var child = nodes[i];
            children += this.parseChild(idMap, child, epMetaData);
            if ( nodes.length > i + 1) {
                children += "|"
            }
        }

        // Remove line breaks
        children = children.replace(/(\r\n|\n|\r)/gm,"");
        // Remove double (and triple) spaces
        children = children.replace(/\s+/g," ");

        result += children;

        // Close cycle
        result += "\}";
        return result;
    };

    // Handle Change Scene nodes
    ctor.prototype.parseChangeScene = function(idMap, node, depth) {
        var sceneName = this.getInkNameFromId(node.sceneId);
        var result = indent(depth);

	result += "~ showMapConfirmation = false";

	result += indent(depth);
	
	// Invoke an Ink function to change the scene (provided in Functions.ink)
        result += "~ ChangeScene({0},{1})".format(sceneName, node.fadeTime);

	result += indent(depth);

	result += "~showMap = false";

	result += indent(depth);

	result += "-> next";
	
        return result;
    };

    // Fade node
    ctor.prototype.parseNodeFade = function(idMap, node, epMetadata) {
	var result = indent(epMetadata.depth);
	result += ">>> FADE";	
	return result;
    };

    // Adds or Removes in-Game Currency (Lyra, Deeds, Demerits, Health)
    ctor.prototype.parseNodeChangeMoney = function(idMap, node, epMetadata) {
	var result = indent(epMetadata.depth);
	
	// TODO: Lookup currency in reference table
	var currencyLookup = ["Lyra", "Deeds", "Demerits", "Health"];
	var currency = currencyLookup[node.currency];
	
	// NO amount specified; don't do anything
	if (node.amount == null) {
	    return;
	}
	
	// Add amount to currency
	if (node.change == 0) {
	    result += "~ RemoveCurrency({0}, {1})".format(currency, node.amount)
	} else {
	    result += "~ AddCurrency({0}, {1})".format(currency, node.amount);
	}
	
	return result;
    };
    
    // Change a character's reputation
    ctor.prototype.parseChangeReputation = function(idMap, node, depth) {
        var result = indent(depth);

        // Get the actor whose rep is being changed
        var actor = node.actorId;
        actor = (actor == null ? "" : idMap[actor]);

        var repVariable = actor + "Reputation";

        var amount = node.amount;
        // Reputation is stored as a variable in Ink
        if (node.change) {
	    // Invoke an Ink function to increase reputation
            result += "~ AddReputation({0}, {1})".format(repVariable, amount);
        } else {
	    // Invoke an Ink function to decrease reputation
            result += "~ RemoveReputation({0}, {1})".format(repVariable, amount);
        }
        
        return result;
    }

    ctor.prototype.parsePlayMusic = function(idMap, node, depth) {
        var musicTrack;

        var result = indent(depth);

        if (node.musicTrack != null) {
            musicTrack = node.musicTrack.slice(0, node.musicTrack.indexOf('.'));
        } else {
            debugger;
        }

	// Invoke an Ink function to play Music
        result += "~ PlayMusic({0})".format(musicTrack); 
        return result;
    };

    ctor.prototype.parseNodePlaceActor = function(idMap, node, depth) {
        var actor;
        var result = indent(depth);
        
        // Get the actor whose rep is being changed
        actor = node.actorId;
        actor = (actor == null ? "" : idMap[actor]);

	// Check to see if there's a transition
	var transition = node.immediate ? false : true;

	// Get the emotion. Convert to lowercase for ink output.
	var emotion = emotionsMap.getEmotionById(node.emotion).toLowerCase();
	
	// Invoke an Ink function to show the actor
        result += "~ ShowActor({0}, {1}, {2})".format(actor, emotion, transition);
        return result;
    };

    ctor.prototype.parseNodeRemoveActor = function(idMap, node, depth) {
        var actor;
        var result = indent(depth);
        
        // Get the actor whose rep is being changed
        actor = node.actorId;
        actor = (actor == null ? "" : idMap[actor]);

	var transition = node.hasTransition;
	
	// Invoke an Ink function to hide the actor
        result += "~ HideActor({0}, {1})".format(actor, transition);
		
        return result;
    };

    ctor.prototype.parsePlaySoundEffect = function(idMap, node, depth) {
        var soundEffect;
        var result = indent(depth);

        if (node.soundEffectName == null) {
            debugger;
        } else {
            soundEffect = node.soundEffectName.slice(0, node.soundEffectName.indexOf('.'));
        }

	// Invoke an Ink function to play the sound
        result += "~ PlaySound({0})".format(soundEffect);
		
        return result;
    };

    ctor.prototype.parseGameOver = function(idMap, node, depth) {
        var result = indent(depth);

        result += "-> END";
        return result;
    };

    ctor.prototype.parseImproveSkill = function(idMap, node, depth) {
        var result = indent(depth);

        var skill = node.skill;

	// Default to 1 if no amount is specified
	var amount = node.amount ? node.amount : 1;
		
	// Invoke an Ink function to improve the skill
        result += "~ ImproveSkill({0}, {1})".format(skill, amount);
		
        return result;
    }

    ctor.prototype.parseChangePropVisibility = function(idMap, node, epMetadata) {
	var result = indent(epMetadata.depth);
	
	// TODO: Better ink name lookup
	var propName = this.data.props[node.propId].inkName;
	if (node.status == "Visible") {
	    result += "~ ShowProp({0})".format(propName);
	} else if (node.status == "Hidden") {
	    result += "~ HideProp({0})".format(propName);
	} else {
	    // TODO: Implement Open, Closed, Opening, and Closing
	}
	
	return result;
    };

    // Mostly overrides command invoke commands
    // TODO: Move this out of Composer
    ctor.prototype.parseInvokeCommand = function(idMap, node, depth) {
        var result = indent(depth);
	var command = node.command.toLowerCase();
        if (command == "map") {
            result += " -> map";
	} else if (command == "playminigame") {
	    result += ">>> PLAYMINIGAME: {0}".format(node.parameter); 
        } else if (command == "continue") {
            result += " ->->";
        } else if (command == "dinnertime") {
            result += " -> dinnertime";
        } else if (command == "sleep") {
            result += " -> sleep";
        } else if (node.parameter) {
            result += "~ {0}({1})".format(command, node.parameter);
        } else {
            result += "~ {0}()".format(command);
        }
        return result;
        
    }

    ctor.prototype.parseScene = function(context, idMap, scene) {
        var sceneInkName = this.getInkName(scene);
        if (this.data.scenes[sceneInkName]) {
            debugger;
            // TODO: scene names are not guaranteed to be unique in Composer,
            // leaving this as a debug step for now
        } else {            
            this.data.scenes[sceneInkName] = {};
            this.data.scenes[sceneInkName].inkName = sceneInkName;
            this.data.scenes[sceneInkName].scripts = {};

            // Todo: parse / generate whatever scene-specific data is appropriate here.
            this.data.scenes[sceneInkName].output = "";
        }
    };

    ctor.prototype.initJournalComments = function(actorName, component) {
	this.data.actors[actorName].comments = [];
	for (var j = 0; j < component.comments.length; j++) {
	    this.data.actors[actorName].comments[j] = component.comments[j];
	}		
    };
    
    ctor.prototype.initCharSheet = function(actorName, component) {
	// This character must be the player
	this.data.player = actorName;
	
	// Store character sheet
	
	// TODO: Define stat list in Composer
	this.data.actors[actorName].stats = {};
	this.data.actors[actorName].stats.Smarts = component.smarts;
	this.data.actors[actorName].stats.Fitness = component.fitness;
	this.data.actors[actorName].stats.Charm = component.charm;
	this.data.actors[actorName].stats.Skills = component.skills;
	this.data.actors[actorName].stats.Luck = component.luck;
	this.data.actors[actorName].stats.Moxie = component.moxie;		
    };
    
    ctor.prototype.parseActor = function(context, idMap, actor) {
	var actorName = actor.name;
	
	if (this.data.actors[actorName]) {
	    debugger;
	    // TODO: Actor names must be unique
	} else {
	    this.data.actors[actorName] = {};
	    
	    this.data.actors[actorName].description = actor.description;
	    
	    // Handle components
	    if (actor.components && actor.components != null) {
		for (var i = 0; i < actor.components.length; i++) {
		    var component = actor.components[i];
		    
		    if (component.type == "components.reputationComponent") {
			this.data.actors[actorName].reputation = component.reputation;
		    } else if (component.type == "character.simpleModel") {
			this.initCharSheet(actorName, component);
		    } else if (component.type == "components.journalQuoteComponent") {
			this.data.actors[actorName].quote = component.quote;
		    } else if (component.type == "components.journalPlayerCommentComponent") {
			this.initJournalComments(actorName, component);
		    }
		}			
	    }
	}
    };
    
    ctor.prototype.parseProp = function(context, idMap, prop) {
	var propId = prop.id;
	var propName = removeWhitespace(prop.name);
	
	if (this.data.props[propId]) {
	    // debugger;
	    // TODO: prop names are not guaranteed to be unique in Composer,
            // leaving this as a debug step for now		
	} else {
	    // Add to data
	    this.data.props[propId] = {};
	    this.data.props[propId].inkName = propName;
	    this.data.props[propId].scripts = {};
	}
		
    };
    
    // Get a unique name for the knot corresponding to the Map trigger for a given scene ID
    ctor.prototype.getMapKnotName = function(sceneId) {
	if (sceneId == null) {
	    // All map triggers must have a scene ID
	    debugger;
	    return "";
	} else {
	    var sceneName = this.getInkNameFromId(sceneId);
	    return sceneName + "Map";
	}
    };

    ctor.prototype.getKnotNameFromScript = function(script) {
	var knotName;
	
	switch (script.trigger.type) {
	case "triggers.enter":
            // For OnEnter scripts, just use the script name
	    knotName = removeWhitespace(script.name);
	    break;
	case "triggers.manual":
            knotName = this.getKnotNameFromScriptId(script.id);
	    break;
	case "triggers.map":
	    knotName = this.getMapKnotName(script.sceneId);
	    break;
	case "triggers.dealCards":
	    knotName = "OnDealCards";
	    break;
	case "triggers.playerWin":
	    knotName = "OnPlayerWin";
	    break;
	case "triggers.playerLose":
	    knotName = "OnPlayerLose";
	    break;
	case "triggers.playerBomb":
	    knotName = "OnPlayerBomb";
	    break;
	case "triggers.playerWater":
	    knotName = "OnPlayerWater";
	    break;
	case "triggers.villainBomb":
	    knotName = "OnVillainBomb";
	    break;
	case "triggers.villainWater":
	    knotName = "OnVillainWater";
	    break;	    
	default:
	    debugger;
	    break;
	}
	return knotName;
    };
    
    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {

        var knotName = this.getKnotNameFromScript(script);
	        
        // Parse entry points
        var entryPointId, entryPointName;
        for (var i = 0; i < script.entryPoints.length; i++) {
            entryPointId = script.entryPoints[i].id;
            entryPointName = script.entryPoints[i].name;
            this.entryPoints[entryPointId] = entryPointName.replace(/\s+/g, '');
        }
        
        if (!script.sceneId) {
	    // If this script is attached to a prop
            if (script.propId) {
		var prop = this.data.props[script.propId];
		prop.scripts[knotName] = "\n=== {0} ===".format(knotName);
	    } else if (script.actorId) {
		// TODO: Handle scripts attached to actors
		// TODO: Look up actor by id
		// var actor = this.data.actors[script.actorId];
		// actor.scripts[knotName] = "\n=== {0} ===".format(knotName);
	    } else {
		debugger;
	    }
        } else {
            var sceneInkName = this.getInkNameFromId(script.sceneId);
            if (!this.data.scenes[sceneInkName]) {
                debugger;
                // TODO Cidney - script names are also not guaranteed to be unique in Composer
            } else if (!this.data.scenes[sceneInkName].scripts) {
                debugger;
            } else {
                this.data.scenes[sceneInkName].scripts[knotName] = "\n=== {0} ===".format(knotName);
                // TODO: parse any other script-level data
            }
        }
    };

    ctor.prototype.getFormattedName = function(entryPoint) {
        return this.getInkName(entryPoint).replace(/\s+/g, '');
    }

    ctor.prototype.parseEntryPoint = function(idMap, entryPoint, entryPointIndex, epMetadata) {
        this.appendOutput(epMetadata, "\n\n= {0}\n// {0} Entry Point\n".format(this.getFormattedName(entryPoint)));
    };

    ctor.prototype.parseEntryPointEnd = function(idMap, entryPoint, entryPointIndex, epMetadata) {

	var triggerType = epMetadata.script.trigger.type;
	if (triggerType == "triggers.dealCards") {
	    this.appendOutput(epMetadata, "\n->DONE");
	} else if (triggerType == "triggers.playerWin" || triggerType == "triggers.playerLose") {
	    // Hack; direct this to dinner for now
	    this.appendOutput(epMetadata, "\n->dinnertime");
	} else {
            this.appendOutput(epMetadata, "\n->->");
	}
        var formattedName = this.getFormattedName(entryPoint);

        for (var i = 0; i < this.menuList.length; i++) {
            this.appendOutput(epMetadata, "\n\n= {0}_Menu_{1}\n".format(formattedName, i+1));
            this.appendOutput(epMetadata, this.menuList[i]);
            this.appendOutput(epMetadata, "\n->->");
        }

        this.menuList = [];
    };

    ctor.prototype.parseChildren = function(idMap, nodes, epMetadata) {
        var children = "";
        for (var i = 0; i < nodes.length; i ++) {
            var child = nodes[i];
            children += this.parseChild(idMap, child, epMetadata);
        }    
        return children;
    };

    ctor.prototype.parseChild = function(idMap, node, epMetadata) {
        var output = "";

        if (node.processed) {
            // Do nothing; this node has already been processed
        } else {
            node.processed = true;
            switch(node.type) {
            case 'nodes.speak' : 
                output = this.parseNodeSpeak(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.branch': 
                output = this.parseNodeBranch(idMap, node, epMetadata.depth, epMetadata);
                break;
	    case 'nodes.fade':
		output = this.parseNodeFade(idMap, node, epMetadata);
		break;
	    case 'nodes.changeMoney':
		output = this.parseNodeChangeMoney(idMap, node, epMetadata);
		break;
	    case 'nodes.changePropVisibility':
		output = this.parseChangePropVisibility(idMap, node, epMetadata);
		break;
            case 'nodes.changeReputation':
                output = this.parseChangeReputation(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.changeScene':
                output = this.parseChangeScene(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.comment' :
                output = this.parseComment(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.nodeCycle' :
                output = this.parseCycle(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.gameOver' :
                output = this.parseGameOver(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.improveSkill' :
                output = this.parseImproveSkill(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.invokeCommand':
                output = this.parseInvokeCommand(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.invokeScript' : 
                output = this.parseNodeInvokeScript(idMap, node, epMetadata);
                break;
            case 'nodes.showMenu' : 
                this.menuList.push(this.parseNodeShowMenu(idMap, node, epMetadata));
				
                output += indent(epMetadata.depth) + "-> {0}_Menu_{1} -> ".format(this.getFormattedName(epMetadata.entryPoint), this.menuList.length);				
                break;
            case 'nodes.placeActor' :
                output = this.parseNodePlaceActor(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.removeActor' :
                output = this.parseNodeRemoveActor(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.playMusic':
                output = this.parsePlayMusic(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.playSoundEffect':
                output = this.parsePlaySoundEffect(idMap, node, epMetadata.depth, epMetadata);
                break;
            case 'nodes.changeTags' : 
                output = this.parseNodeChangeTags(idMap, node, epMetadata);
                break;
	    case 'nodes.questionAndAnswer':
		output = this.parseNodeQuestionAndAnswer(idMap, node, epMetadata);
		break;
            case 'nodes.setVariable' : 
                output = this.parseNodeSetVariable(idMap, node, epMetadata);
                break;
	    case 'nodes.showStore' :
		output = this.parseNodeShowStore(idMap, node, epMetadata);
		break;
	    case 'nodes.showVignette':
		output = this.parseNodeShowVignette(idMap, node, epMetadata);
		break;		
	    case 'nodes.hideVignette':
		output = this.parseNodeHideVignette(idMap, node, epMetadata);
		break;
            default:
                output = "\n// TODO - " + node.type;
                break;
            }
        }
        
        return output;
    }

    ctor.prototype.parseNodeShowVignette = function(idMap, node, epMetadata) {
	var result = indent(epMetadata.depth);

	result += ">>> SHOWVIGNETTE: {0}".format(node.vignetteName);
	
	return result;
    };

    ctor.prototype.parseNodeHideVignette = function(idMap, node, epMetadata) {
	var result = indent(epMetadata.depth);

	result += ">>> HIDEVIGNETTE";
	
	return result;
    };
    
    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {        
        epMetadata.depth++;
        var output = this.parseChild(idMap, node, epMetadata);
        this.appendOutput(epMetadata, output);
        epMetadata.depth--;
    };

    ctor.prototype.getActorData = function(fieldName) {
	var result = "";
	var actors = db.actors.entries;
	
	for (var i = 0; i < actors.length; i++) {
	    var actor = actors[i];			
	    var component = fieldName.toLowerCase();
	    
	    if (this.data.actors[actor.name] && this.data.actors[actor.name][component]) {
		var value = this.data.actors[actor.name][component];
		if (Array.isArray(value)) {
		    // Output a value for each member of the array
		    for (var j = 0; j < value.length; j++) {
			result += "\nVAR {0}{1}{2} = \"{3}\"\n".format(actor.name, fieldName, j+1, value[j]);							
		    }					
		} else if (value % 1 === 0) {
		    // If the value is an integer
		    result += "\nVAR {0}{1} = {2}".format(actor.name, fieldName, value);				
		    } else {
			value = value.replace(/(\r\n|\n|\r)/gm, " ");
			result += "\nVAR {0}{1} = \"{2}\"\n".format(actor.name, fieldName, value);
		    }
	    } else {
		// No component found for this actor; but all characters have a reputation
		if (component == "reputation") {
		    result += "\nVAR {0}{1} = {2}".format(actor.name, fieldName, 0);
		}
	    }
	}
	
	return result;
	
    };	
    
    ctor.prototype.getListFromDB = function(composerListName, inkListName, getName) {
	var composerList = db[composerListName].entries;
	
	if (composerList.length > 0) {
	    var inkList = "";
	    var inkItem;
	    
	    for (var i = 0; i < composerList.length; i++) {
		inkItem = getName(composerList[i]);
		if (i < composerList.length - 1) {
		    inkItem += ", ";
		}
		inkList += inkItem;
	    }
	    
	    return "\n// List of Assets\nLIST {0} = {1}\n".format(inkListName, inkList);				
	} else {
	    return "";
	}
    };
    
    
    ctor.prototype.getPlayerInitData = function() {
	var result = "";
	if (this.data.player) {
	    result = "\n\nVAR PLAYER = {0}\n".format(this.data.player);
	    
	    var playerData = this.data.actors[this.data.player].stats;
	    for (var key in playerData) {
		var value = playerData[key];
		result += "\nVAR {0} = {1}".format(key, value);
	    }
	    
	    result +="\n";
	}
	return result;
    };
    
    // Get the name of an audio clip for Ink
    ctor.prototype.getClipName = function(item) {
	return removeSpecialCharacters(removeWhitespace(item.slice(0, item.indexOf('.'))));
    };
    
	// Get the name of a composer entity (actor, scene, etc) for Ink
    ctor.prototype.getEntityName = function(item) {
	return removeSpecialCharacters(removeWhitespace(item.name));
    };
    
    // Get a list of props and include it in the script
    ctor.prototype.getPropList = function() {
	
	var propList = "";
	var orderedPropNames = [];
	for (var propId in this.data.props) {
	    var prop = this.data.props[propId];
	    orderedPropNames.push(prop.inkName);
	}
	
	orderedPropNames.sort();
	for (var i = 0; i < orderedPropNames.length; i++) {
	    var propItem = orderedPropNames[i];
	    if (i < orderedPropNames.length - 1) {
		propItem += ", ";
	    }
	    propList += propItem;
	}
	
	if (propList != "") {
	    return "\nLIST Props = {0}\n".format(propList);
	} else {
	    return "";
		}	
    };
    
    ctor.prototype.finish = function(context, idMap) {
        baseProcessor.prototype.finish.call(this, context, idMap);
	
        // This should generate:
        // One <gameName.ink> file importing all of the tag, inventory, variable, scene, and scene\script entries
        // the inventory, variablee, scene, and scene\script entries
        var gameOutput = '';

        // TODO: Generate author and name from project
        gameOutput += "\n# author: Corey and Lori Cole";
        gameOutput += "\n# title: Summer Daze at Hero-U";
	gameOutput +="\n\nVAR IsDebug = {0}".format(context.mode == "debug");
        gameOutput += "\nVAR IsDemo = {0}\n".format(context.isDemo);

	gameOutput += this.getListFromDB("musicTracks", "MusicTracks", this.getClipName);
	gameOutput += this.getListFromDB("soundEffects", "SoundClips", this.getClipName);
	gameOutput += this.getListFromDB("actors", "Actors", this.getEntityName);
	gameOutput += this.getListFromDB("scenes", "Rooms", this.getEntityName);
	
	// Get room display names from Composer
	var rooms = db["scenes"].entries;
	for (var i = 0; i < rooms.length; i++) {
	    gameOutput += "\nVAR {0}Name = \"{1}\"\n".format(this.getEntityName(rooms[i]), rooms[i].displayName || rooms[i].name);
	}		
	
	// Get the description field from Composer
	gameOutput += this.getActorData("Description");
	
	// Get components attached to actors
	gameOutput += this.getActorData("Quote");
	gameOutput += this.getActorData("Comments");
	gameOutput += this.getActorData("Reputation");				
	gameOutput += this.getPlayerInitData();
	
	gameOutput += this.getPropList();
	
	// generate the tag list file
        if (this.tagList.length == 1) {
            this.appendTagList("filler");
        }

        if (this.tagList.length > 0) {
            gameOutput += this.writeList(context, "Tags", "Tags", this.tagList);    
        }

        // generate the constants and variables files
        if (this.constList.length == 1) {
            this.appendConstList(["filler"]);
        }

        if (this.constList.length > 0) {
            gameOutput += this.writeAssignment(context, "Constants", this.constList);    
        }

        if (this.varList.length > 0) {
            var varInkList = [];
            var variable;
            for (var i = 0; i < this.varList.length; i++) {
                variable = this.varList[i];
                addToArray(varInkList, "\nVAR {0} = 0".format(variable));
            }
            gameOutput += this.writeAssignment(context, "Variables", varInkList);    
        }

        gameOutput += "\n";
        
        // Copy over and include all files in both the standalone Composer/Data/Ink directory 
        // as well as the project's Composer/Data/Ink directory
        gameOutput += this.importNongeneratedInkFiles(context, process.cwd());
        gameOutput += this.importNongeneratedInkFiles(context, context.game.dir);
		
        // For each scene, generate its ink file and its associated scripts
        var orderedSceneNames = [];
        for(var scene in this.data.scenes){
            orderedSceneNames.push(scene);
        }

	orderedSceneNames.sort();
        for (var i = 0; i < orderedSceneNames.length; i++) {
            // add its file to the final game output too
            gameOutput += "\nINCLUDE " + orderedSceneNames[i] + ".ink";

            // Make sure the scene directory exists
            fileSystem.makeDirectory(path.join(context.inkOutputDirectory, "/" + orderedSceneNames[i]));

            var sceneWriter = baseWriter.createFileWriter(path.join(context.inkOutputDirectory, orderedSceneNames[i] + '.ink'));
            sceneWriter.write(this.data.scenes[orderedSceneNames[i]].output);
            sceneWriter.end();

            // also write its child scripts
            var orderedScriptNames = [];
            for (var script in this.data.scenes[orderedSceneNames[i]].scripts) {
                orderedScriptNames.push(script);
            }
            orderedScriptNames.sort();
            for (var j = 0; j < orderedScriptNames.length; j++) {

                // add its file to the final game output too
                var combinedFilename = orderedSceneNames[i] + "/" + orderedScriptNames[j];
                gameOutput += "\nINCLUDE " + combinedFilename + ".ink";

                var scriptWriter = baseWriter.createFileWriter(path.join(context.inkOutputDirectory, combinedFilename + '.ink'));
                scriptWriter.write(this.data.scenes[orderedSceneNames[i]].scripts[orderedScriptNames[j]]);
                scriptWriter.end();
            }
        }

        // Start at the bootstrapped scene
        // TODO: Get this knot name dynamically
        var startKnot = "Intro";

        gameOutput += "\n-> {0} -> next".format(startKnot);

        // Generate the one ink file to rule them all
        var gameFileWriter = baseWriter.createFileWriter(path.join(context.inkOutputDirectory, context.game.gameInternalName + '.ink'));
        gameFileWriter.write(gameOutput);
        gameFileWriter.end();
    };

    // Keep track of all tags in the Ink story
    ctor.prototype.appendTagList = function(tags) {
        if (isNotEmpty(tags)) {       
            tags = tags.split(", ");
            for (var i = 0; i < tags.length; i++) {
                addToArray(this.tagList, removeWhitespace(tags[i]));
            }
        }
    }

    // Keep track of all variables in the Ink story
    ctor.prototype.appendVarList = function(singleVar) {
        if (isNotEmpty(singleVar)) {
            // Cidney: Day and Time are special, and the potential values are in Lists
            if (singleVar != "time" && singleVar != "day") {

                singleVar = singleVar.replace(/\./g,'');

                // Unless it's already in the list of variables in the story, append it
                if (this.varList.indexOf(singleVar) == -1) {
                    addToArray(this.varList, singleVar);     
                }    
            }                
        }
    }

    // Keep track of all constants in the Ink story
    ctor.prototype.appendConstList = function(singleConst) {
        // Check to make sure the constant isn't a number
        if (isNotEmpty(singleConst) && Number.isNaN(singleConst)) {
            addToArray(this.constList, "\nCONST {0} = {1}".format(singleConst));
        }
    }

    ctor.prototype.writeList = function(context, fileName, listName, listContents) {
        if (!Array.isArray(listContents)) {
            throw new Error("writeList() expects a listContents array!");
        }
        var output = indent(0) + "LIST " + listName + " = ";
        for (var i = 0; i < listContents.length; i++) {
            output += "{0}".format(listContents[i]);
            if (i < (listContents.length - 1)) {
                output += ", ";
            }
        }
        var writer = baseWriter.createFileWriter(path.join(context.inkOutputDirectory, fileName + '.ink'));
        writer.write(output);
        writer.end();

        return '\nINCLUDE ' + fileName + '.ink';
    };

    ctor.prototype.writeAssignment = function(context, fileName, listContents) {
        if (!Array.isArray(listContents)) {
            throw new Error("writeAssignment() expects a listContents array!");
        }
        var output = "";
        for (var i = 0; i < listContents.length; i++) {
            output += listContents[i];
        }
        var writer = baseWriter.createFileWriter(path.join(context.inkOutputDirectory, fileName + '.ink'));
        writer.write(output);
        writer.end();

        return '\nINCLUDE ' + fileName + '.ink';
    };

    ctor.prototype.importNongeneratedInkFiles = function(context, baseDirectory) {
        var composerDataInkDir = path.join(baseDirectory, '/Data/Ink');
        if (fileSystem.exists(composerDataInkDir)) {
            var files = fileSystem.readDir(composerDataInkDir);
            var output = [];
            for(var i=0;i<files.length;i++) {
                var file = files[i];
                // Copy the non-generated file to the generated output directory, and import it
                var origFile = path.join(composerDataInkDir, file);
                var destFile = path.join(context.inkOutputDirectory, file);
                fileSystem.write(destFile, fileSystem.read(origFile));
                output.push('INCLUDE ' + file);
            }
            return (output.length == 0 ? '' : ('\n' + output.join('\n')));
        } else {
            return "";
        }
    }

    return new ctor();
});

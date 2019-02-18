define(function(require){
    var path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
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

	function isNotEmpty(someText) {
		return someText && null != someText && someText.length > 0;
	}

	function appendIfNotEmpty(origVal, potentiallyAppend) {
		return (isNotEmpty(potentiallyAppend) ? (origVal + potentiallyAppend) : origVal);
	}

	function addToArray(list, potentialValue) {
		if (list && isNotEmpty(potentialValue) && list.indexOf(potentialValue) == -1) {
			list.push(potentialValue);
		}
	}

	function removeWhitespace(text) {
		if(text && null != text) {
			return text.replace(/\s/g,'');
		}
		return text;
	}

    function indent(depth) {
    	var result = '\n';
    	for (var i = 0; i < depth; i++) {
    		result += "    ";
    	}
    	return result;
    }

    // I HATE DURANDAL AND ITS INABILITY TO SUPPORT JAVASCRIPT CLASS DEFINITIONS

    function parseNodes(children, depth) {
    	if (!children || children.length == 0) {
    		return "";
    	}
    	var result = "";

		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var s = parse_nodeByType(child, depth + 1);
			result = appendIfNotEmpty(result, s);
		}
 
    	return result;
    }

    function parseEntryPoint(id, name, nodes) {
    	var result = "\n\n"
    	var formattedName = removeWhitespace(name);
        entryPointIdToInkName[id] = formattedName;

		result += "= {0}\n".format(formattedName);

		if (nodes.length > 0) {
			result += parseNodes(nodes, 1);
		}

		return result;
    }

    function parseScript(id, name, entryPoints) {
		var result = "\n"
		
		var knotname = removeWhitespace(name);
        scriptIdToInkName[id] = knotname;
        
		result += ("=== {0} ===".format(knotname));

		if (entryPoints && entryPoints.length > 0) {
			for (var i = 0; i < entryPoints.length; i++) {
				var entry = entryPoints[i];
				result += parseEntryPoint(entry.id, entry.name, entry.nodes);
			}
		}

		return result;
    }

	function parse_nodeByType(node, depth) {
		var output;
		switch(node.type) {
			case 'script': 
				output = parseScript(node);
				break;
			case 'nodes.branch': 
				output = parse_node_branch(node, depth);
				break;
			case 'nodes.changeTags' : 
				output = parse_node_changeTags(node, depth);
				break;
			case 'nodes.invokeScript' : 
				output = parse_node_invokeScript(node, depth);
				break;
			case 'nodes.setVariable' : 
				output = parse_node_setVariable(node, depth);
				break;
			case 'nodes.showMenu' : 
				output = parse_node_showMenu(node, depth);
				break;
			case 'nodes.speak' : 
				output = parse_node_speak(node, depth);
				break;
			case 'nodes.comment' :
				output = parseComment(node, depth);
				break;
			default:
				output = "\n# TODO - " + node.type;
				break;
		}
		return output;
	}

	function parse_node_changeTags(node, depth) {
		var result = "";
		if (node.tagsToAdd) {
			result = appendIfNotEmpty(result, parse_node_changeTags_helper(node.tagsToAdd, "~ Tags +=", depth));
		}
		if (node.tagsToRemove) {
			result = appendIfNotEmpty(result, parse_node_changeTags_helper(node.tagsToRemove, "~ Tags -=", depth));
		}
		return result;
	}

	function parse_node_changeTags_helper(tagList, prefix, depth) {
		var result = "";
		if (isNotEmpty(tagList)) {
			tagList = tagList.replace(",", ", ");
			result += indent(depth);
			var tags = tagList.split(",");
			if (tags.length > 1) {
				result += "{0} ({1})".format(prefix, tagList);
			} else {
				result += "{0} {1}".format(prefix, tagList);
			}

			append_tag_list(tagList);
		}
		return result;
	}

	function parse_node_invokeScript(node, depth) {
		var knot = getScriptInkName(node.scriptId);
		var stitch = getEntrypointInkName(node.entryPointId)
		
		// Add introductory white space
		var result = indent(depth);
		if (isNotEmpty(stitch)) {
			result += "-> {0}.{1}".format(knot, stitch);
		} else {
			result += "-> {0}".format(knot);
		}

		return result;
	}

	function parse_node_setVariable(node, depth) {
		var result = indent(depth);

		// TODO: Implement for values and ranges of values
		result += "~ {0} = {1}".format(node.name, 0);
		return result;
	}

	function parse_node_showMenu(node, depth) {
		var options = node.options;
		var weaveName = removeWhitespace(node.id);

		var autoAddDone = !!node.AutoAddDone;

		// TODO: unique is not used??
		var unique = !!node.Unique;

		var result = indent(depth) + "- ({0})".format(weaveName);

		if (options) {
			for (var i = 0; i < options.length; i++) {
				result += parse_option(options[i], depth, weaveName);
			}
		}
		if (autoAddDone) {
			result += (indent(depth) + "+ Done\n  -> DONE");
		}

		return result;
	}

	function parse_option(node, depth, parentId) {
		var alwaysShow = !!node.ignoreChildAvailability;
		var expression = node.expression;

		var result = indent(depth);

		if (alwaysShow) {
			result += "+ ";
		} else {
			result += "* ";
		}
		if (expression) {
			result += "{{ {0} }} ".format(parse_expression(expression));
		}
		if (node.text) {
			result += "{0}".format(node.text);
		}

		result += parseNodes(node.nodes, depth);
		result += indent(depth) + "-> {0}".format(parentId);

		return result;
	}

	function parse_node_speak(node, depth) {
		var result = indent(depth);

		var speaker = node.actorId;
		speaker = (speaker == null ? "" : db.actors.lookup[speaker].name);

		// TODO: Listener is never used?
		var listener = node.actorId2;
		listener = (listener == null ? "" : db.actors.lookup[listener].name);

		result += "{0}: {1}".format(speaker, node.text);
		return result;
	}

	function parse_node_branch(node, depth) {
		var result = "";
		if (node.sections && node.sections.length > 0) {
			for (var i = 0; i < node.sections.length; i++) {
				var s = parse_node_branch_section(node.sections[i], depth + 1);
				if (isNotEmpty(s)) {
					result += indent(depth + 1) + "- {0}".format(s);
				}
			}
		}

		if (isNotEmpty(result)) {
			result = indent(depth) + "{" + result + indent(depth) + "}";
		}
		return result;
	}

	function parse_node_branch_section(section, depth) {
		var expression = section["expression"];
		var result = "";

		var parsed_children = parseNodes(section["nodes"], depth);
		if (expression) {
			result += "{0}:".format(parse_expression(expression));
			result += parsed_children;
		} else {
			// this is just a block of nodes; no expression to evaluate
			if (isNotEmpty(parsed_children)) {
				result += "else: {0}".format(parsed_children);
			}
		}

		return result;
	}

	function parse_expression(node) {
        var left = node.left;
        var right = node.right;
        var tags = node.tags;
        var has = node.has;
        var prop = node.propId;

        var result = "";

        switch(node.type) {
            case "expressions.variableComparison":
            	var operatorVal;
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
            	var varName = removeWhitespace(node.variableName);
            	append_var_list(varName);
            	var constName = removeWhitespace(node.compareTo);
            	append_const_list(constName);
            	result += "{0} {1} {2}".format(varName, operatorVal, constName);
                break;
            case "expressions.or":
                result += "{0} {1} {2}".format(parse_expression(left), "||", parse_expression(right));
                break;
            case "expressions.and":
                result += "{0} {1} {2}".format(parse_expression(left), "&&", parse_expression(right));
                break;
            case "expressions.inInventory":
            	prop = db.props.lookup[prop].name;
            	addToArray(inv_list, prop);
            	if (has) {
					result += "Inventory has {0}".format(prop);
            	} else {
            		result += "Inventory has ({0})".format(prop);
            	}
                break;
            case "expressions.inTags":
            	append_tag_list(tags);
            	if (has) {
            		result += "Tags has {0}".format(tags);
            	} else {
            		result += "Tags has ({0})".format(tags);
            	}
                break;
            case "expressions.skillCheck":
                result += "true";
                break;
            case "expressions.previousScene":
                result += "true";
                break;
            case "expressions.isPoisoned":
                result += "false";
                break;
            case "expressions.propStatus":
                result += "true";
                break;
            case "expressions.debugOnly":
                result += "true";
                break;

            case "expressions.currentScene":
                // TODO: Implement Has Active Quest
                result += "true";
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
            case "expressions.reputationComparison":
                // TODO: Implement Reputation Comparison
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
	}

	function parseComment(node, depth) {
		result = indent(depth);
		result += "### {0}".format(node.message);
		return result;
	}

	var tag_list = [];
	var var_list = [];
	var const_list = [];
	var inv_list = [];

	// Map of Script.Id to its Ink-formatted Name
	var scriptIdToInkName = {};

	// Map of EntryPoint.Id to its Ink-formatted Name
	var entryPointIdToInkName = {};

	function inititalize() {
		tag_list = [];
		var_list = [];
		const_list = [];
		inv_list = [];
	}

	function getScriptInkName(scriptId) {
		if (isNotEmpty(scriptId)) {
			if (! scriptIdToInkName[scriptId]) {
				var scriptEntry = db.scripts.lookup[scriptId];
				if (scriptEntry) {
					scriptIdToInkName[scriptId] = removeWhitespace(scriptEntry.name);
				} else {
					return "ERROR_UNKNOWN_SCRIPT_" + scriptId;
				}
			}
			return scriptIdToInkName[scriptId];
		}
		return "";
	}

	function getEntrypointInkName(entryPointId) {
		if (isNotEmpty(entryPointId)) {
			if (! entryPointIdToInkName[entryPointId]) {
				return "ERROR_UNKNOWN_ENTRYPOINT_" + entryPointId;
			}
			return entryPointIdToInkName[entryPointId];
		}
		return "";
	}

	function append_tag_list(tags) {
		if (isNotEmpty(tags)) {		  
        	tags = tags.split(", ");
			for (var i = 0; i < tags.length; i++) {
                addToArray(tag_list, removeWhitespace(tags[i]));
			}
		}
	}

	function append_var_list(singleVar) {
		if (isNotEmpty(singleVar)) {
			singleVar = singleVar.replace(/\./g,'');
			addToArray(var_list, singleVar);
		}
	}

	function append_const_list(singleConst) {
		// Check to make sure the constant isn't a number
		if (isNotEmpty(singleConst) && Number.isNaN(singleConst)) {
			addToArray(const_list, singleConst);
		}
	}

	/* Initialize a list of tags, used for game state. All tags here are GLOBAL. */
	function init_tags() {
		var result = "\nLIST Tags = ";
		for (var i = 0; i < tag_list.length; i++) {
			result += "({0})".format(tag_list[i]);
			if (i < (tag_list.length - 1)) {
				result += ", ";
			}
		}
		return result;
	}

	/* Initialize variables used in the game */
	function init_vars() {
		var result = "";
		for (var i = 0; i < var_list.length; i++) {
			result += "\nVAR {0} = false".format(var_list[i]);
		}
		return result;
	}

	/* Initialize constant values (such as variable names) used in the game */
	function init_consts() {
		var result = "";
		for (var i = 0; i < const_list.length; i++) {
			result += "\nCONST {0} = {1}".format(const_list[i], i);
		}
		return result;
	}

	/* Initialize the inventory list */
	function init_inventory() {
		var result = "\nLIST Inventory = "
		for (var i = 0; i < inv_list.length; i++) {
			result += "({0})".format(inv_list[i]);
			if (i < (inv_list.length - 1)) {
				result += ", ";
			}
		}
		return result;
	}

    return {
        convertScript:function(script) {
        	inititalize();
        	var result = parseScript(script.id, script.name, script.entryPoints);

            var output = "";
            output += init_tags() + "\n";
            output += init_vars() + "\n";
            output += init_consts() + "\n";
            output += init_inventory() + "\n";
            output += result;
            output += "\n\n=== invoke ===\n+ Something\n-> DONE";

        	return output;
        }
    };
});
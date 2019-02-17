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
			appendIfNotEmpty(result, s);
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
			default:
				output = "\n# TODO - " + node.type;
				break;
		}
		return output;
	}

	function parse_node_changeTags(node, depth) {
		var result = "";
		if (node.tagsToAdd) {
			appendIfNotEmpty(result, parse_node_changeTags_helper(node.tagsToAdd, "~ Tags +=", depth));
		}
		if (node.tagsToRemove) {
			appendIfNotEmpty(result, parse_node_changeTags_helper(node.tagsToRemove, "~ Tags -=", depth));
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
		// TODO

		var result = "";
		return result;
	}

	function parse_node_showMenu(node, depth) {
		// TODO

		var result = "";
		return result;
	}

	function parse_node_speak(node, depth) {
		// TODO

		var result = "";
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
        // TODO

        var result = "";
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

	function getEntrypointInkName(entryPointId) {
		if (! entryPointIdToInkName[entryPointId]) {
			return "ERROR_UNKNOWN_ENTRYPOINT_" + entryPointId;
		}
		return entryPointIdToInkName[entryPointId];
	}

	function append_tag_list(tags) {
		if (isNotEmpty(tags)) {		  
        	tags = tags.split(", ");
			for (var i = 0; i < tags.length; i++) {
                addToArray(tag_list, removeWhitespace(tags[i]));
			}
		}
	}

    return {
        convertScript:function(script) {
        	inititalize();
        	var result = parseScript(script.id, script.name, script.entryPoints);

            var output = "";
            /*
                print >>f, init_tags()
                print >>f, init_vars()
                print >>f, init_consts()
                print >>f, init_inventory()
                */

            output += result;
            output += "\n\n=== invoke ===\n+ Something\n-> DONE";

        	return output;
        }
    };
});
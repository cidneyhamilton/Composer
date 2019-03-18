// Generate .ink scripts within Composer
// See https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md for documentation

define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'), 
        baseWriter = require('features/build/baseWriter'),
        path = requireNode('path'),
        fileSystem = require('infrastructure/fileSystem'),
        serializer = require('plugins/serializer'),
        db = require('infrastructure/assetDatabase'),
        system = require('durandal/system'),
        emotionsMap = require('features/constants/emotions');

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

    var ctor = function () {
        baseProcessor.call(this);
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.init = function() {
        this.data = {};
        this.data.scenes = {};
        this.inkNameLookup = {};
        this.idToInkNameMap = {};
        this.tag_list = [];
        this.var_list = [];
        this.const_list = [];
        this.inv_list = [];
    };

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

    ctor.prototype.appendOutput = function(epMetadata, output) {
        if (isNotEmpty(output)) {
            var sceneName = this.getInkNameFromId(epMetadata.script.sceneId);
            var scriptName = this.getInkNameFromId(epMetadata.script.id);
            this.data.scenes[sceneName].scripts[scriptName] += output;
        }
    };

    // Handle Tag Changing
    ctor.prototype.parseNodeChangeTags = function(idMap, node, depth) {
        var result = "";
        if (node.tagsToAdd) {
            result = appendIfNotEmpty(result, this.parseNodeChangeTagsHelper(idMap, node.tagsToAdd, "~ Tags +=", depth));
        }
        if (node.tagsToRemove) {
            result = appendIfNotEmpty(result, this.parseNodeChangeTagsHelper(idMap, node.tagsToRemove, "~ Tags -=", depth));
        }
        return result;
    };

    ctor.prototype.parseNodeChangeTagsHelper = function(idMap, tagList, prefix, depth) {
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

            this.append_tag_list(tagList);
        }
        return result;
    };

    // Handle Invoke Scripts
    ctor.prototype.parseNodeInvokeScript = function(idMap, node, depth) {

        var knot, stich;
        
        knot = this.getInkNameFromId(node.scriptId);

        // If the script hasn't been loaded yet, it won't be in the dictionary of script names
        if (knot.includes("ERROR_UNKNOWN_ID_")) {
            // If we haven't already figured out the name of this script, look it up from the assets DB
            var scripts = db.scripts.entries.filter(function(entry) {
                return entry.triggerType == 'triggers.manual';
            }).filter(function(item){
                return item.id == node.scriptId;
            });

            knot = scripts[0].name || '???';
        }

        // If the script is in the current scope, use entry points; otherwise, default to Main
        if (this.currentScope == "Current") {
            stitch = this.getInkNameFromId(node.entryPointId);
        } else {
            stitch = "";
        }
        
        // Add introductory white space
        var result = indent(depth);
        if (isNotEmpty(stitch)) {
            result += "-> {0}.{1}".format(knot, stitch);
        } else {
            result += "-> {0}".format(knot);
        }

        return result;
    };

    // Handle setting variables
    ctor.prototype.parseNodeSetVariable = function(idMap, node, depth) {
        var result = indent(depth);

        // TODO: Implement for values and ranges of values
        result += "~ {0} = {1}".format(node.name, 0);
        return result;
    };

    // Handle Show Menu nodes
    ctor.prototype.parseNodeShowMenu = function(idMap, node, depth) {
        var options = node.options;
        var weaveName = removeWhitespace(node.id);

        var autoAddDone = !!node.AutoAddDone;

        // TODO: unique is not used??
        var unique = !!node.Unique;

        var result = indent(depth) + "- ({0})".format(weaveName);

        if (options) {
            for (var i = 0; i < options.length; i++) {
                result += this.parseOption(idMap, options[i], depth, weaveName);
            }
        }
        if (autoAddDone) {
            result += (indent(depth) + "+ Done\n  -> DONE");
        }

        return result;
    };

    // Handle Options
    ctor.prototype.parseOption = function(idMap, node, depth, parentId) {
        var alwaysShow = !!node.ignoreChildAvailability;
        var expression = node.expression;

        var result = indent(depth);

        if (alwaysShow) {
            result += "+ ";
        } else {
            result += "* ";
        }
        if (expression) {
            result += "{{ {0} }} ".format(this.parseExpression(idMap, expression));
        }
        if (node.text) {
            result += "{0}".format(node.text);
        }

        result += this.parseNodes(idMap, node.nodes, depth);
        result += indent(depth) + "-> {0}".format(parentId);

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
        if (node.emotion != 0) {
            tagString += "# {0} ".format(emotionsMap.getEmotionById(node.emotion));
        } else if (listener != "" && node.emotion2 != 0) {
            tagString += "# {0} ".format(emotionsMap.getEmotionById(node.emotion2));
        }

        result += "{0}: {1} {2}".format(speaker, node.text, tagString);
        return result;
    };

    // Handle Branching
    ctor.prototype.parseNodeBranch = function(idMap, node, depth) {
        var result = "";
        if (node.sections && node.sections.length > 0) {
            for (var i = 0; i < node.sections.length; i++) {
                var s = this.parseNodeBranchSection(idMap, node.sections[i], depth + 1);
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
    ctor.prototype.parseNodeBranchSection = function(idMap, section, depth) {
        var expression = section["expression"];
        var result = "";

        var parsed_children = this.parseNodes(idMap, section["nodes"], depth);
        if (expression) {
            result += "{0}:".format(this.parseExpression(idMap, expression));
            result += parsed_children;
        } else {
            // this is just a block of nodes; no expression to evaluate
            if (isNotEmpty(parsed_children)) {
                result += "else: {0}".format(parsed_children);
            }
        }

        return result;
    };

    // Handle Expressions in Branches
    ctor.prototype.parseExpression = function(idMap, node) {
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
                this.append_var_list(varName);
                var constName = removeWhitespace(node.compareTo);
                this.append_const_list(constName);
                result += "{0} {1} {2}".format(varName, operatorVal, constName);
                break;
            case "expressions.or":
                result += "{0} {1} {2}".format(this.parseExpression(idMap, left), "||", thisparseExpression(idMap, right));
                break;
            case "expressions.and":
                result += "{0} {1} {2}".format(this.parseExpression(idMap, left), "&&", this.parseExpression(idMap, right));
                break;
            case "expressions.inInventory":
                prop = this.getInkNameFromId[prop];
                addToArray(this.inv_list, prop);
                if (has) {
                    result += "Inventory has {0}".format(prop);
                } else {
                    result += "Inventory has ({0})".format(prop);
                }
                break;
            case "expressions.inTags":
                this.append_tag_list(tags);
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
    };

    // Handle Composer-side comments
    ctor.prototype.parseComment = function(idMap, node, depth) {
        var result = indent(depth);
        result += "### {0}".format(node.message);
        return result;
    };

    // Handle Change Scene nodes
    ctor.prototype.parseChangeScene = function(idMap, node, depth) {
        var sceneName = this.getInkNameFromId(node.sceneId);
        var result = indent(depth);
        result += "~ ChangeScene({0})".format(sceneName);
        return result;
    }

    ctor.prototype.parsePlayMusic = function(idMap, node, depth) {
       var result = indent(depth);
       var musicTrack = node.musicTrack.slice(0, node.musicTrack.indexOf('.'));

       console.log("Music Track {0}".format(musicTrack));

       result += "~ PlayMusic({0})".format(musicTrack);
       return result;
    }

    ctor.prototype.parseInvokeCommand = function(idMap, node, depth) {
        var result = indent(depth);

        if (node.parameter) {
            result += "~ {0}({1})".format(node.command, node.parameter);
        } else {
            result += "~ {0}()".format(node.command);
        }
        return result;
        
    }

    ctor.prototype.parseScene = function(context, idMap, scene) {
        var sceneInkName = this.getInkName(scene);

        if (this.data.scenes[sceneInkName]) {
            debugger;
            // TODO: Cidney - scene names are not guaranteed to be unique in Composer,
            // leaving this as a debug step for now
        } else {            
            this.data.scenes[sceneInkName] = {};
            this.data.scenes[sceneInkName].inkName = sceneInkName;
            this.data.scenes[sceneInkName].scripts = {};

            // Todo: parse / generate whatever scene-specific data is appropriate here.
            this.data.scenes[sceneInkName].output = "";
        }
    };

    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {
        var knotname = this.getInkName(script);

        if (!script.sceneId) {
            debugger;
            // TODO: Cidney - not sure how / if scripts on Actors / Props should be parsed in Ink,
            // so leaving this as a debug step for now.
        } else {
            var sceneInkName = this.getInkNameFromId(script.sceneId);
            if (!this.data.scenes[sceneInkName]) {
                debugger;
                // TODO Cidney - script names are also not guaranteed to be unique in Composer
            } else if (!this.data.scenes[sceneInkName].scripts) {
                debugger;
            } else {
                this.data.scenes[sceneInkName].scripts[knotname] = "\n=== {0} ===".format(knotname);
                // TODO: parse any other script-level data
            }
        }
    };

    ctor.prototype.parseEntryPoint = function(idMap, entryPoint, entryPointIndex, epMetadata) {
        var formattedName = this.getInkName(entryPoint);
        this.appendOutput(epMetadata, "\n\n= {0}\n".format(formattedName));
    };


    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {        
        switch(node.type) {
            case 'nodes.branch': 
                output = this.parseNodeBranch(idMap, node, epMetadata.depth + 1);
                break;
            case 'nodes.changeTags' : 
                output = this.parseNodeChangeTags(idMap, node, epMetadata.depth + 1);
                break;
            case 'nodes.invokeScript' : 
                output = this.parseNodeInvokeScript(idMap, node, epMetadata.depth + 1);
                break;
            case 'nodes.setVariable' : 
                output = this.parseNodeSetVariable(idMap, node, epMetadata.depth + 1);
                break;
            case 'nodes.showMenu' : 
                output = this.parseNodeShowMenu(idMap, node, epMetadata.depth + 1);
                break;
            case 'nodes.speak' : 
                output = this.parseNodeSpeak(idMap, node, epMetadata.depth + 1);
                break;
            case 'nodes.comment' :
                output = this.parseComment(idMap, node, epMetadata.depth + 1);
                break;
            case 'nodes.changeScene':
                output = this.parseChangeScene(idMap, node, epMetadata.depth + 1);
                break;
            case 'nodes.playMusic':
                output = this.parsePlayMusic(idMap, node, epMetadata.depth + 1);
                break;
            case 'nodes.invokeCommand':
                output = this.parseInvokeCommand(idMap, node, epMetadata.depth +1);
                break;
            default:
                output = "\n# TODO - " + node.type;
                break;
        }

        this.appendOutput(epMetadata, output);
    };

    ctor.prototype.finish = function(context, idMap) {
        baseProcessor.prototype.finish.call(this, context, idMap);

        // This should generate:
        // One <gameName.ink> file importing all of the tag, inventory, variable, scene, and scene\script entries
        // the inventory, variablee, scene, and scene\script entries

        // generate the tags and inventory list files
        this.writeList(context, "Tags", "Tags", this.tag_list);
        this.writeList(context, "Inventory", "Inventory", this.inv_list);

        // generate the constants and variables files
        this.writeAssignment(context, "Constants", this.const_list);
        this.writeAssignment(context, "Variables", this.var_list);

        var gameOutput = "\nINCLUDE Tags.ink"
            + "\nINCLUDE Inventory.ink"
            + "\nINCLUDE Constants.ink"
            + "\nINCLUDE Variables.ink"
            + "\nINCLUDE Functions.ink";

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
        // Generate the one ink file to rule them all
        var gameFileWriter = baseWriter.createFileWriter(path.join(context.inkOutputDirectory, context.game.gameInternalName + '.ink'));
        gameFileWriter.write(gameOutput);
        gameFileWriter.end();
    };

    ctor.prototype.append_tag_list = function(tags) {
        if (isNotEmpty(tags)) {       
            tags = tags.split(", ");
            for (var i = 0; i < tags.length; i++) {
                addToArray(this.tag_list, removeWhitespace(tags[i]));
            }
        }
    }

    ctor.prototype.append_var_list = function(singleVar) {
        if (isNotEmpty(singleVar)) {
            singleVar = singleVar.replace(/\./g,'');
            addToArray(this.var_list, "\nVAR {0} = false".format(singleVar));
        }
    }

    ctor.prototype.append_const_list = function(singleConst) {
        // Check to make sure the constant isn't a number
        if (isNotEmpty(singleConst) && Number.isNaN(singleConst)) {
            addToArray(this.const_list, "\nCONST {0} = {1}".format(singleConst));
        }
    }

    ctor.prototype.writeList = function(context, fileName, listName, listContents) {
        if (!Array.isArray(listContents)) {
            throw new Error("writeList() expects a listContents array!");
        }
        var output = indent(0) + "LIST " + listName + " = ";
        for (var i = 0; i < listContents.length; i++) {
            output += "({0})".format(listContents[i]);
            if (i < (listContents.length - 1)) {
                output += ", ";
            }
        }
        var writer = baseWriter.createFileWriter(path.join(context.inkOutputDirectory, fileName + '.ink'));
        writer.write(output);
        writer.end();
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
    };

    return new ctor();
});
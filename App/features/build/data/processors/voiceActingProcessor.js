define(function(require){
    var baseProofreadProcessor = require('features/build/data/processors/baseProofreadProcessor'),
        minigamesMap = require('features/constants/minigames'),
        emotionsMap = require('features/constants/emotions');

    function getMysteryIfNull(potentiallyNullValue) {
        return (potentiallyNullValue ? potentiallyNullValue : "???");
    }

    var ctor = function () {
        baseProofreadProcessor.call(this, 'voice_actor_text');
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
	
        switch (nodeType) {
        case 'Speak' :
	    out.push(this.listEntryStart);
            out.push(idMap.getDisplayValue(epMetadata.sceneName, epMetadata.script, 'actor', node.actorId) + " <span style=\"font-size: small; color: green\">[" + emotionsMap.getEmotionById(node.emotion) + "]</span> ");
	    
            if (node.device && node.device != 0) {
                out.push(" <i>(" + emotionsMap.getDeviceById(node.device) + ")</i> ");
            }
            out.push(" : " + this.htmlEscape(node.text));
            break;
        default:               
            // fallthrough
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

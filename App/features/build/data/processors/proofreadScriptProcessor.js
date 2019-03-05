define(function(require){
    var baseProofreadProcessor = require('features/build/data/processors/baseProofreadProcessor');

    var ctor = function () {
        baseProofreadProcessor.call(this, 'game_text');
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.init = function() {
        baseProofreadProcessor.prototype.init.call(this);
    };

    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {
        // Only handle scripts with 1+ entry points
        if (script.entryPoints && scripts.entryPoints.length > 0) {
            // check if data already exists for this scene
            if (!this.dataTable[sceneName]) {
                this.dataTable[sceneName] = [];
            }
            this.dataTable[sceneName].push(script);
        }
    };

    ctor.prototype.writeData = function(idMap, writer, scene, scripts) {
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];

            if (!script.entryPoints) {
                continue;
            }
            for (var j = 0; j < script.entryPoints.length; j++) { 
                this.writeEntryLeft(writer, scene, script, script.entrypoints[j]);
                this.writeEntryRight(writer, scene, script, script.entrypoints[j]);
            }
        }
    }

    ctor.prototype.writeHtmlFooter = function(writer) {
        writer.write("<script src=\"game_text.js\"></script>\r\n");
        baseProofreadProcessor.prototype.writeHtmlFooter.call(this, writer);
    };

    ctor.prototype.writeSidebarEntry = function(idMap, writer, scene, script, entryPoint) {
        writer.write("<b>Scene</b>: " + scene + this.newline)
                    + "<b>Script</b>: " + script.name + this.newline);
        var out = [];
        if (script.storyEventId) {
            out.push("<b>During</b>: " + idMap[script.storyEventId] + this.newline);
        }
        if (script.propId) {
            out.push("<b>For</b>: " + idMap[script.propId] + this.newline);
        }
        if (script.actorId) {
            out.push("<b>For</b>: " + idMap[script.actorId] + this.newline);
        }
        if (script.triggerType) {
            out.push("<b>On</b>: " + script.item.trigger.name + this.newline);
        }
        writer.write(out.join('')
                    + "<b>EntryPoint</b>: " + entryPoint.name + this.newline
                    + "<b>Script Id</b>: " + script.id + this.newline);
    };

    ctor.prototype.writeMainEntry = function(idMap, writer, scene, script, entryPoint) {
        if (entryPoint.nodes) {
            _writeNodesArr(writer, out, entryPoint.nodes, 1);
        }
    };

    return ctor;
});
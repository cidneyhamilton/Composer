define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'),
        baseWriter = require('features/build/baseWriter'),
        path = requireNode('path'),
        selectedGame = require('features/projectSelector/index');

    var ctor = function () {
        baseProcessor.call(this);

        this.newline = "\r\n<br/>\r\n";
        this.listEntryStart = "<li>";
        this.listEntryEnd = "</li>\r\n";;
        this.listStart = "<ul>\r\n";
        this.listStartHidden = "<ul class=\"hideStyle\">\r\n";
        this.listEnd = "</ul>\r\n";

        this.filename = arguments[0];
        this.filenames = [];
        // Ugly, but this allows for a variable # of filenames.
        for (var i = 1; i < arguments.length; ++i) {
            this.filenames.push(arguments[i]);
        }
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.init = function() {
        this.dataTables = {};
        this.dataTable = {};
        this.dataTables[this.filename] = this.dataTable;
        for (var i = 0; i < this.filenames.length; i++) {
            var file = this.filenames[i];
            this.dataTables[file] = {};
        }
    };

    ctor.prototype.writeSidebarEntry = function(idMap, writer, scene, entry, addlInfo) { };

    ctor.prototype.writeMainEntry = function(idMap, writer, scene, entry, addlInfo) {};

    ctor.prototype.getPageTitle = function(writer) {
        return selectedGame.activeProject.gameName + " (Proofread)";
    };

    ctor.prototype.htmlEscape = function(itemToWrite) {
        if (itemToWrite) {
            return (itemToWrite.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        }
        return "";
    };

    ctor.prototype.writeHtmlHeader = function(writer) {
        writer.write("<!DOCTYPE html>\r\n" 
            + "<html>\r\n"
            + "<head>\r\n"
            + "<meta charset=\"UTF-8\">"
            + "<title>" + this.getPageTitle(writer) + "</title>\r\n"
            + "<link rel=\"stylesheet\" href=\"game_text.css\"/>\r\n"
            + "</head>\r\n" 
            + "<body>\r\n"
            + "<script src=\"jquery-1.11.3.min.js\"></script>\r\n"
            + "<script src=\"jquery.viewport.mini.js\"></script>\r\n"
            + "\r\n");
    };

    ctor.prototype.writeEntryLeft = function(idMap, writer, scene, entry, addlInfo) {
        writer.write("<section>\r\n"
                    + "<div class=\"left\">\r\n"
                    + "<div class=\"floater\">" );
        this.writeSidebarEntry(idMap, writer, scene, entry, addlInfo);
        writer.write("</div>\r\n" 
                    + "</div>\r\n");
    };

    ctor.prototype.writeEntryRight = function(idMap, writer, scene, entry, addlInfo) {
        writer.write("<div class=\"right\">\r\n"
                    + this.listStartHidden);
        this.writeMainEntry(idMap, writer, scene, entry, addlInfo);
        writer.write(this.listEnd
                    + "</div>\r\n"
                    + "<div class=\"clear\"></div>\r\n"
                    + "</section>\r\n");
    };

    ctor.prototype.writeData = function(idMap, writer, scene, data) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            this.writeEntryLeft(idMap, writer, scene, item);
            this.writeEntryRight(idMap, writer, scene, item);
        }
    }

    ctor.prototype.writeHtmlFooter = function(writer) {
        writer.write("</body>\r\n</html>");
    };

    ctor.prototype.createWriter = function(fileName, gameTextFilePath) {
        return baseWriter.createFileWriter(gameTextFilePath);
    }

    ctor.prototype.finish = function(context, idMap) {
        for (var file in this.dataTables) {
            var gameTextFilePath = path.join(context.internalDocOutputDirectory, file + ".html");
            var writer = this.createWriter(file, gameTextFilePath);
            this.writeHtmlHeader(writer);
            var orderedKeys = [];
            for(var key in this.dataTables[file]){
                orderedKeys.push(key);
            }
            orderedKeys.sort();
            for (var i = 0; i < orderedKeys.length; i++) {
                writer.write("<article>\r\n");
                this.writeData(idMap, writer, orderedKeys[i], this.dataTables[file][orderedKeys[i]]);
                writer.write("</article>\r\n");
            }
            this.writeHtmlFooter(writer);
            writer.end();
        }
    };

    return ctor;
});
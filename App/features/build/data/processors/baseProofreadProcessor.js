define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'),
        path = requireNode('path');

    var ctor = function () {
        baseProcessor.call(this);

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

    ctor.prototype.createWriter = function(fileName, filePath) {};

    ctor.prototype.finish = function(context, idMap) {
        for (var file in this.dataTables) {
            var gameTextFilePath = path.join(context.internalDocOutputDirectory, file + ".html");
            var writer = this.createWriter(file, gameTextFilePath);
            writer.writeHtmlHeader();
            var orderedKeys = [];
            for(var key in this.dataTables[file]){
                orderedKeys.push(key);
            }
            orderedKeys.sort();
            for (var i = 0; i < orderedKeys.length; i++) {
                writer.writeData(orderedKeys[i],this.dataTables[file][orderedKeys[i]]);
            }
            writer.writeHtmlFooter();
            writer.end();
        }
    };

    return ctor;
});
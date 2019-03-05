define(function(reqire){
    var baseWriter = require('features/build/baseWriter'),
        inkConvert = require('features/build/data/inkConvert')
        ;

    var newline = "\r\n";

    function indent(depth) {
        var result = newline;
        if (depth) {
            for (var i = 0; i < depth; i++) {
                result += "    ";
            }
        }
        return result;
    }

    var ctor = function(path) {
        baseWriter.call(this, path);
    };

    ctor.prototype = Object.create(baseWriter.prototype);
    ctor.prototype.constructor = baseWriter;

    ctor.prototype.writeScript = function(script) {
        var output;

        this.writeStream.write(output, this.encoding);
    };

    ctor.prototype.writeList = function(listName, listContents, depth) {
        if (!Array.isArray(listContents)) {
            throw new Error("inkWriter.writeList() expects a listContents array!");
        }
        var output = inkConvert.convertList(listName, listContents, depth);

        this.writeStream.write(output, this.encoding);
    };

    ctor.createFileWriter = function(path) {
        return new ctor(path + ".ink");
    };

    return ctor;
});
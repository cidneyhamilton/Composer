define(function(reqire){
    var baseWriter = require('infrastructure/baseWriter')
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

    ctor.prototype.writeList = function(listName, listContents, depth) {
        if (!Array.isArray(listContents)) {
            throw new Error("inkWriter.writeList() expects a listContents array!");
        }

        var output = indent(depth) + "LIST " + listName + " = ";
        for (var i = 0; i < listContents.length; i++) {
            output += "({0})".format(listContents[i]);
            if (i < (listContents.length - 1)) {
                output += ", ";
            }
        }

        this.writeStream.write(output, this.encoding);
    };

    ctor.createFileWriter = function(path) {
        return new ctor(path + ".ink");
    };

    return ctor;
});
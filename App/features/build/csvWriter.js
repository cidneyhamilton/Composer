define(function(require){
    var papaParse = require('papaparse'),
        baseWriter = require('features/build/baseWriter')
        ;

    var ctor = function(path, callbackOnEnd) {
        baseWriter.call(this, path, callbackOnEnd);
    };

    ctor.prototype = Object.create(baseWriter.prototype);
    ctor.prototype.constructor = baseWriter;

    ctor.prototype.writeRecord = function(rec) {
        if (!rec) return; // ignore empty records
        if (!Array.isArray(rec)) {
            throw new Error("CsvWriter.writeRecord only takes an array as an argument");
        }
        try {
            var parsedItem = papaParse.unparse(rec, { header : false, quotes : true, quoteChar: '"', escapeChar: '"', delimiter: "," } );
            parsedItem = parsedItem.replace(/^,/, "\"\",").replace(/,$/, ",\"\"");
            this.writeStream.write(parsedItem + "\r\n", this.encoding);
        } catch (e) {
            debugger;
        }
    };

    ctor.createFileWriter = function(path, callbackOnEnd) {
        return new ctor(path, callbackOnEnd);
    };

    return ctor;
});
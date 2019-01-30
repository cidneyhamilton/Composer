define(function(require){
    var fs = requireNode('fs'),
        events = requireNode('events'),
        papaParse = require('papaparse')
        ;

    var sys;
    try {
        sys = requireNode('util');
    } catch (e) {
        sys = requireNode('sys');
    }

    function _setOptions(obj, options) {
        options = options || {};
        obj.separator = (typeof options.separator !== 'undefined') ? options.separator : ',';
        obj.quotechar = (typeof options.quote !== 'undefined') ? options.quote : '"';
        obj.escapechar = (typeof options.escape !== 'undefined') ? options.escape : '"';
        obj.commentchar = (typeof options.comment !== 'undefined') ? options.comment : '';
        obj.columnNames = (typeof options.columnNames !== 'undefined') ? options.columnNames : [];
        obj.columnsFromHeader = (typeof options.columnsFromHeader !== 'undefined') ? options.columnsFromHeader : false;
        obj.nestedQuotes = (typeof options.nestedQuotes !== 'undefined') ? options.nestedQuotes : false;
    }

    var ctor = function(writeStream, options) {
        this.writeStream = writeStream;
        _setOptions(this, options);
        this.encoding = options.encoding || 'utf8';

        if (typeof writeStream.setEncoding === 'function') {
            writeStream.setEncoding(this.encoding);
        }

        writeStream.addListener('drain', this.emit.bind(this, 'drain'));
        writeStream.addListener('error', this.emit.bind(this, 'error'));
        writeStream.addListener('close', this.emit.bind(this, 'close'));
    };

    sys.inherits(ctor, events.EventEmitter);

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

    ctor.prototype.end = function(){
        this.writeStream.end();
    };

    ctor.createFileWriter = function(path, options, callbackOnEnd) {
        options = options || {'flags': 'w'};

        var writeStream = fs.createWriteStream(path, {
            'flags': options.flags || 'w'
        });

        if(callbackOnEnd) {
            writeStream.on('finish', callbackOnEnd);
        }

        return new ctor(writeStream, options);
    };

    return ctor;
});
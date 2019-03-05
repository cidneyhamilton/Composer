define(function(reqire){
    var fs = requireNode('fs'),
        events = requireNode('events');

    var sys;
    try {
        sys = requireNode('util');
    } catch (e) {
        sys = requireNode('sys');
    }

    var newline = "\r\n";

    // Write an instance of the usage, and each scene + script where it's used
    function _writeInstanceUsage(out, instanceName, sourceMap) {
        if (instanceName) {
            out.push("\t* "+ instanceName + newline);
            var sourceList = [];
            if (sourceMap) {
                for (var source in sourceMap) {
                    sourceList.push(source);
                }
                sourceList.sort();
                for (var i in sourceList) {
                    out.push("\t\t- " + sourceList[i] + newline);
                }
            }
        }
    }

    // Handle writing each instance
    function _writeInstance(writer, instanceNameList, instanceMap) {
        var out = [];
        // Order by instanceNameList so the ordering can be consistent
        for (var i in instanceNameList) {
            var instanceName = instanceNameList[i];
            _writeInstanceUsage(out, instanceName, instanceMap[instanceName]);
        }
        out.push(newline);
        writer.writeStream.write(out.join(''), this.encoding);
    }

    var ctor = function(writeStream) {
        this.writeStream = writeStream;
        this.encoding = 'utf8';

        if (typeof writeStream.setEncoding === 'function') {
            writeStream.setEncoding(this.encoding);
        }

        writeStream.addListener('drain', this.emit.bind(this, 'drain'));
        writeStream.addListener('error', this.emit.bind(this, 'error'));
        writeStream.addListener('close', this.emit.bind(this, 'close'));
    };

    sys.inherits(ctor, events.EventEmitter);

    ctor.prototype.writeReport = function(instanceType, instanceNameList, instanceMap) {
        if (!Array.isArray(instanceNameList)) {
            throw new Error("nestedReportWriter.writeReport() expects a instanceNameList array!");
        }

        this.writeStream.write(
              instanceType + newline, this.encoding);
        _writeInstance(this, instanceNameList, instanceMap);
    };

    ctor.prototype.end = function(){
        this.writeStream.end();
    };

    ctor.createFileWriter = function(path) {

        var writeStream = fs.createWriteStream(path, {
            'flags': 'w'
        });

        var writer = new ctor(writeStream);

        return writer;
    };

    return ctor;
});
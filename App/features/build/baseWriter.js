define(function(require){
    var fs = requireNode('fs'),
        events = requireNode('events'),
        fileWriteTracker = require('infrastructure/fileWriteTracker')
        ;

    var sys;
    try {
        sys = requireNode('util');
    } catch (e) {
        sys = requireNode('sys');
    }

    var ctor = function(path, addlFinishCallback) {
        this.path = path;
        this.writeStream = fs.createWriteStream(path, {
            'flags': 'w'
        });
        this.encoding = 'utf8';

        this.writeStream.addListener('drain', this.emit.bind(this, 'drain'));
        this.writeStream.addListener('error', this.emit.bind(this, 'error'));
        this.writeStream.addListener('close', this.emit.bind(this, 'close'));

        fileWriteTracker.flagWrite(path);

        if (addlFinishCallback) {
            this.writeStream.on('finish', function() { addlFinishCallback(); fileWriteTracker.flagFlush(this.path); });
        } else {
            this.writeStream.on('finish', function() { fileWriteTracker.flagFlush(this.path); });
        }
    };

    sys.inherits(ctor, events.EventEmitter);

    ctor.prototype.write = function(output) {
        this.writeStream.write(output, this.encoding);
    };

    ctor.prototype.end = function(){
        this.writeStream.end();
    };

    ctor.createFileWriter = function(path) {
        return new ctor(path);
    };

    return ctor;
});
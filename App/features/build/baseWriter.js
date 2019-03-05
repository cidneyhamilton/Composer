define(function(require){
    var fs = requireNode('fs'),
        events = requireNode('events')
        ;

    var sys;
    try {
        sys = requireNode('util');
    } catch (e) {
        sys = requireNode('sys');
    }

    var ctor = function(path) {
        this.path = path;
        this.writeStream = fs.createWriteStream(path, {
            'flags': 'w'
        });
        this.encoding = 'utf8';

        this.writeStream.addListener('drain', this.emit.bind(this, 'drain'));
        this.writeStream.addListener('error', this.emit.bind(this, 'error'));
        this.writeStream.addListener('close', this.emit.bind(this, 'close'));
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
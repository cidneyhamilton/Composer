define(function(require){

    var ctor = function() {
        this.pendingWrites = [];
    };

    ctor.prototype.hasWrites = function() {
        return this.pendingWrites.length > 0;
    };

    ctor.prototype.numWritesRemaining = function() {
        return this.pendingWrites.length;
    };

    ctor.prototype.flagWrite = function(fileName) {
        this.pendingWrites.push(fileName);
    };

    ctor.prototype.flagFlush = function(fileName){
        var index = this.pendingWrites.indexOf(fileName);
        if (index > -1) {
            this.pendingWrites.splice(index, 1);
        }
    };

    return new ctor();
});
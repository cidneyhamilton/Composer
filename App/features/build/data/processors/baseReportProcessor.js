define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'),
        reporter = require('features/build/data/report');

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
        this.reports = {};
        this.report = reporter.create(this.filename);
        this.reports[this.filename] = this.report;
        for (var i = 0; i < this.filenames.length; i++) {
            var file = this.filenames[i];
            this.reports[file] = reporter.create(file);
        }
    };

    ctor.prototype.finish = function(context, idMap) {
        this.reports[this.filename].write(context.reportsOutputDirectory);
        for (var i = 0; i < this.filenames.length; i++) {
            var file = this.filenames[i];
            this.reports[file].write(context.reportsOutputDirectory);
        }
    };

    return ctor;
});
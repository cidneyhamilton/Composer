define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'),
        reporter = require('features/build/data/report');

    var ctor = function (filename) {
        baseProcessor.call(this);
        this.report = reporter.create(filename);
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.finish = function(context) {
        this.report.write(context.reportsOutputDirectory);
    };

    return ctor;
});
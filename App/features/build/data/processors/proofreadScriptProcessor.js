define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'),
    
        ProofreadWriter = require('infrastructure/proofreadWriter'),
        reporter = require('features/build/data/report');

    var ctor = function (filename) {
        baseProcessor.call(this);

        this.report = reporter.create(filename);

        this.scriptTable = {};
        this.propTable = {};
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.finish = function(context) {
        var gameTextFileName = path.join(context.internalDocOutputDirectory, 'game_text.html');
        writeProofreadFile(ProofreadWriter.createFileWriter(gameTextFileName), scriptTable);
    };

    return ctor;
});
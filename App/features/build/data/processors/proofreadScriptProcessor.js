define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'),
    
        ProofreadWriter = require('infrastructure/proofreadWriter'),
        reporter = require('features/build/data/report');

    var ctor = function (filename) {
        baseProcessor.call(this);
        this.fileName = filename;
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.init = function() {
        this.report = reporter.create(this.fileName);
        this.scriptTable = {};
        this.propTable = {};  
    };

    ctor.prototype.finish = function(context) {
        var gameTextFileName = path.join(context.internalDocOutputDirectory, 'game_text.html');
        writeProofreadFile(ProofreadWriter.createFileWriter(gameTextFileName), scriptTable);
    };

    return ctor;
});
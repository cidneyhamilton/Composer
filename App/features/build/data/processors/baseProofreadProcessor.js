define(function(require){
    var baseProcessor = require('features/build/data/processors/baseProcessor'), 
        ProofreadSimpleWriter = require('infrastructure/proofreadSimpleWriter');
        ProofreadWriter = require('infrastructure/proofreadWriter');

    var ctor = function (filename, writeExtended) {
        baseProcessor.call(this);
        this.writerSource = (!!writeExtended) ? ProofreadSimpleWriter : ProofreadWriter;
        this.filename = filename;
    };

    ctor.prototype = Object.create(baseProcessor.prototype);
    ctor.prototype.constructor = baseProcessor;

    ctor.prototype.init = function() {
        this.dataTable = {};
    };

    ctor.prototype.finish = function(context, idMap) {
        var gameTextFileName = path.join(context.internalDocOutputDirectory, this.filename + ".html");
        var writer = writerSource.createFileWriter(gameTextFileName);
        writer.writeHtmlHeader();
        for(var key in dataTable){
            writer.writeData(key, dataTable[key]);
        }
        writer.writeHtmlFooter();
        writer.end();
    
    };

    return ctor;
});
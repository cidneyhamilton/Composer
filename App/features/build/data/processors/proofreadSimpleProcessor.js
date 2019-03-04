define(function(require){
    var baseProofreadProcessor = require('features/build/data/processors/baseProofreadProcessor'),
        ProofreadSimpleWriter = require('infrastructure/proofreadSimpleWriter'),
        db = require('infrastructure/assetDatabase');

    var ctor = function () {
        this.actorFilename = 'actor_text';
        this.propFilename = 'prop_text';

        baseProofreadProcessor.call(this, this.actorFilename, this.propFilename);
        this.fileNameToType = {};
        this.fileNameToType[this.actorFilename] = 'Actor';
        this.fileNameToType[this.propFilename] = 'Prop';
    };

    ctor.prototype = Object.create(baseProofreadProcessor.prototype);
    ctor.prototype.constructor = baseProofreadProcessor;

    ctor.prototype.init = function() {
        baseProofreadProcessor.prototype.init.call(this);
        this.dataTables[this.actorFilename][""] = [];
    };

    ctor.prototype.createWriter = function(filename, filePath) {
        return ProofreadSimpleWriter.createFileWriter(filePath, this.fileNameToType[filename]);
    };

    ctor.prototype.parseActor = function(context, idMap, actor) {
        this.dataTables[this.actorFilename][""].push(actor);
    };

    ctor.prototype.parseProp = function(context, idMap, prop) {
        var sceneToPropMap = this.dataTables[this.propFilename][idMap[prop.sceneId]];
        if (null == sceneToPropMap) {
            this.dataTables[this.propFilename][idMap[prop.sceneId]] = [];
        }
        this.dataTables[this.propFilename][idMap[prop.sceneId]].push(prop);
    };

    return new ctor();
});
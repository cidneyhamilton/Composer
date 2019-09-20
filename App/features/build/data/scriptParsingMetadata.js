define(function(require) {

    function scriptParsingMetadata(sceneName, script, entryPoint, depth, isUniqueNode, nodeAutoAddDone, isParsingNodeSuccessFailure) {
        var metadata = {};
        metadata.sceneName = sceneName;
        metadata.script = script;
        metadata.entryPoint = entryPoint;
        metadata.depth = depth || 0;
        metadata.unique = isUniqueNode;
        metadata.autoAddDone = nodeAutoAddDone;

        metadata.isSuccessFailure = isParsingNodeSuccessFailure;
        return metadata;
    };

    function scriptParsingMetdataBuilder(sceneName, script, entryPoint) {
        var builder = {};
        builder.sceneName = sceneName;
        builder.script = script;
        builder.entryPoint = entryPoint;

        builder.build = function(depth) {
            return new scriptParsingMetadata(this.sceneName, this.script, this.entryPoint, depth);
        };
        builder.buildUniqueAutoAdd = function(depth, isUniqueNode, nodeAutoAddDone) {
            return new scriptParsingMetadata(this.sceneName, this.script, this.entryPoint, depth, isUniqueNode, nodeAutoAddDone);
        };
        builder.buildSuccessFailure = function(depth, isParsingNodeSuccessFailure) {
            return new scriptParsingMetadata(this.sceneName, this.script, this.entryPoint, depth, undefined, undefined, isParsingNodeSuccessFailure);
        };
        builder.buildDeeper = function(scriptMetadata) {
            return new scriptParsingMetadata(scriptMetadata.sceneName, scriptMetadata.script, scriptMetadata.entryPoint, 
                scriptMetadata.depth + 1, scriptMetadata.unique, scriptMetadata.autoAddDone, scriptMetadata.isSuccessFailure);
        }
        return builder;
    }

    return {
        getBuilder: function(sceneName, script, entryPoint) {
            return new scriptParsingMetdataBuilder(sceneName, script, entryPoint);
        }
    };
});
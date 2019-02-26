define(function(require){

    var ctor = function () { 
    };

    ctor.prototype.populateAssetMap = function(assetType, assetEntry) {
    };

    ctor.prototype.initialize = function(idMap) {
    };

    ctor.prototype.parseScript = function(idMap, sceneName, script) {};
    ctor.prototype.parseEntryPoint = function(idMap, sceneName, script, entryPoint) {};
    ctor.prototype.parseSectionArray = function(idMap, sceneName, script, sectionArray) {};
    ctor.prototype.parseSection = function(idMap, sceneName, script, section) {};
    ctor.prototype.parseNodeArray = function(idMap, sceneName, script, nodeArray) {};
    ctor.prototype.parseNode = function(idMap, sceneName, script, node) {};
    ctor.prototype.parseTopLevelExpression = function(idMap, sceneName, script, expression) {};
    ctor.prototype.parseExpression = function(idMap, sceneName, script, expression) {};

    ctor.prototype.finish = function(idMap) {};
        
    return ctor;
});
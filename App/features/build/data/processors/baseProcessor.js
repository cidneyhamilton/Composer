define(function(require){

    var ctor = function () { 
    };

    ctor.prototype.populateAssetMap = function(assetType, assetEntry) {
    };

    ctor.prototype.initialize = function(idMap) {
    };

    ctor.prototype.parseScript = function(idMap, script) {};
    ctor.prototype.parseEntryPoint = function(idMap, script, entryPoint) {};
    ctor.prototype.parseSection = function(idMap, script, allEntryPoints, parentNode, section, singleSection) {};
    ctor.prototype.parseExpression = function(idMap, script, expression) {};

    ctor.prototype.finish = function() {};
        
    return ctor;
});
define(function(require){

    var ctor = function () { 
    };

    // This is pre-idMap-initialization
    ctor.prototype.init = function() {};

    // All of these are post-idMap-initialization

    ctor.prototype.parseLocalizationGroup = function(context, idMap, localizationGroup) {};
    ctor.prototype.parseScene = function(context, idMap, scene) {};
    ctor.prototype.parseActor = function(context, idMap, actor) {};
    ctor.prototype.parseConstant = function(context, idMap, constant) {};
    ctor.prototype.parseStoryEvent = function(context, idMap, storyEvent) {};
    ctor.prototype.parseProp = function(context, idMap, prop) {};
    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {};

    // The following are used for script parsing.  See scriptParsingMetadata.js for the details of epMetadata
    ctor.prototype.parseEntryPoint = function(idMap, entryPoint, entryPointIndex, epMetadata) {};
    ctor.prototype.parseEntryPointEnd = function(idMap, entryPoint, entryPointIndex, epMetadata) {};

    ctor.prototype.parseSectionArray = function(idMap, sectionArray, epMetadata, sectionType) {};
    ctor.prototype.parseSectionArrayEnd = function(idMap, sectionArray, epMetadata, sectionType) {};

    ctor.prototype.parseSection = function(idMap, section, sectionIndex, epMetadata) {};
    ctor.prototype.parseSectionEnd = function(idMap, section, sectionIndex, epMetadata) {};

    ctor.prototype.parseNodeArray = function(idMap, nodeArray, epMetadata) {};
    ctor.prototype.parseNodeArrayEnd = function(idMap, nodeArray, epMetadata) {};

    ctor.prototype.parseNode = function(idMap, node, nodeType, nodeIndex, epMetadata) {};
    ctor.prototype.parseNodeEnd = function(idMap, node, nodeType, nodeIndex, epMetadata) {};

    ctor.prototype.parseTopLevelExpression = function(idMap, expression, epMetadata) {};
    ctor.prototype.parseExpression = function(idMap, expression, epMetadata) {};

    // This is run after everything (across all types) have been read
    ctor.prototype.finish = function(context, idMap) {};
        
    return ctor;
});
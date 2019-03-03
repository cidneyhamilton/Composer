define(function(require){

    var ctor = function () { 
    };

    ctor.prototype.init = function() {};

    // All of these are post-idMap-initialization

    ctor.prototype.parseLocalizationGroup = function(context, idMap, localizationGroup) {};
    ctor.prototype.parseScene = function(context, idMap, scene) {};
    ctor.prototype.parseActor = function(context, idMap, actor) {};
    ctor.prototype.parseStoryEvent = function(context, idMap, storyEvent) {};
    ctor.prototype.parseProp = function(context, idMap, prop) {};
    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {};

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
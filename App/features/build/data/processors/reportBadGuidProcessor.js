define(function(require){
    var baseReportProcessor = require('features/build/data/processors/baseReportProcessor');

    var ctor = function () {
        baseReportProcessor.call(this, 'badGuids');
    };

    ctor.prototype = Object.create(baseReportProcessor.prototype);
    ctor.prototype.constructor = baseReportProcessor;

    ctor.prototype.parseProp = function(context, idMap, prop) {
        // Props may have bad sceneIds
        if (prop.sceneId && !idMap[prop.sceneId]) {
            this.report.log('Prop: ' + prop.name + ' (file: Composer/Data/Props/' + prop.id + '.json)', ' Is Orphaned by Deleted Scene: ' + prop.sceneId);
        }
    };

    ctor.prototype.parseScript = function(context, idMap, script, sceneName) {        
        // Scripts may have bad values too
        if (script.storyEventId && !idMap[script.storyEventId]) {
            this.report.log('Script: ' + script.name + ' (file: Composer/Data/Scripts/' + script.id + '.json)', ' Is Orphaned by Deleted StoryEvent: ' + script.storyEventId);
        }
        if (script.sceneId && !idMap[script.sceneId]) {
            this.report.log('Script: ' + script.name + ' (file: Composer/Data/Scripts/' + script.id + '.json)', ' Is Orphaned by Deleted Scene: ' + script.sceneId);
        }
        if (script.propId && !idMap[script.propId]) {
            this.report.log('Script: ' + script.name + ' (file: Composer/Data/Scripts/' + script.id + '.json)', ' Is Orphaned by Deleted Prop: ' + script.propId);
        }
        if (script.actorId && !idMap[script.actorId]) {
            this.report.log('Script: ' + script.name + ' (file: Composer/Data/Scripts/' + script.id + '.json)', ' Is Orphaned by Deleted Actor: ' + script.actorId);
        }
    };

    ctor.prototype.finish = function(context, idMap) {
        // also generate the bad variables report, since it's basically a subset of the variables report.
        var badGuids = idMap.badIds;
        for(var i = 0; i < badGuids.length; i++) {
            var badGuid = badGuids[i];
            this.report.log(badGuid.sceneName + ' - Script: ' + badGuid.scriptName + ' (file: Composer/Data/Scripts/' + badGuid.scriptId + '.json)', ' Refers To Deleted ' + badGuid.type + ": " + badGuid.typeId);
        }
        baseReportProcessor.prototype.finish.call(this, context, idMap);
    };

    return new ctor();
});
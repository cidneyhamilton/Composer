define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        questStatusMap = require('features/constants/questStatus'),
        loadedConstants = require('features/constants/loadedConstants');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.propId = attributes.propId || null;
        this.sceneId = loadedConstants.questsSceneId; 
        this.questStatus = attributes.questStatus || 0;

    };

    ctor.prototype.getDescription = function(){
        var that = this;

        var results = assetDatabase.props.entries.filter(function(item){
            return item.id == that.propId;
        });

        var prop = results[0] || { name:'???' };

        return questStatusMap.getQuestStatusById(this.questStatus) + ': \"<span class="prop">' + prop.name + '</span>\"' ;
    };

    ctor.type = 'expressions.hasActiveQuest';
    ctor.displayName = 'Quest Status';

    return ctor;
});
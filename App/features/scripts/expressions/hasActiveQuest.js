define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        questStatusMap = require('features/constants/questStatus');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.propId = attributes.propId || null;
        this.sceneId = 'e8520824-d970-4c6e-8aec-6c308c8846ab';  // Quests Scene
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
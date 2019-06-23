define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        achievementStatusMap = require('features/constants/achievementStatus'),
        loadedConstants = require('features/constants/loadedConstants');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.propId = attributes.propId || null;
        this.sceneId = loadedConstants.achievementsSceneId; 
        this.achievementStatus = attributes.achievementStatus || 0;
    };

    ctor.prototype.getDescription = function(){
        var that = this;

        var prop = assetDatabase.props.lookup[that.propId] || { name:'???' };

       return achievementStatusMap.getAchievementStatusById(this.achievementStatus) + ': \"<span class="prop">' + prop.name + '</span>\"' ;
    };

    ctor.type = 'expressions.hasAchievement';
    ctor.displayName = 'Has Achievement';

    return ctor;
});
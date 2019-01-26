define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        achievementStatusMap = require('features/constants/achievementStatus');

    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.propId = attributes.propId || null;
        this.sceneId = 'a4d66827-dd60-451f-8015-62b8abb42f0c';  // Achievements Scene
        this.achievementStatus = attributes.achievementStatus || 0;
    };

    ctor.prototype.getDescription = function(){
        var that = this;

        var results = assetDatabase.props.entries.filter(function(item){
            return item.id == that.propId;
        });

        var prop = results[0] || { name:'???' };

       return achievementStatusMap.getAchievementStatusById(this.achievementStatus) + ': \"<span class="prop">' + prop.name + '</span>\"' ;
    };

    ctor.type = 'expressions.hasAchievement';
    ctor.displayName = 'Has Achievement';

    return ctor;
});
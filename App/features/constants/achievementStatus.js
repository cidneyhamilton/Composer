define(function(require) {

	var achievementStatus = [
		{ id:'0', name: 'Has Achievement'},
		{ id:'1', name: 'Does NOT have Achievement'}	
    ];

    return {
        achievementStatus: achievementStatus,
        getAchievementStatusById: function(id) {
            if (typeof id !== 'undefined') {
                 return achievementStatus[parseInt(id)].name;
            }
        }
    };
});
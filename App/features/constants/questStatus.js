define(function(require) {

	var questStatus = [
		{ id:'0', name: 'Active Quest'},
		{ id:'1', name: 'Completed Quest'},
		{ id:'2', name: 'Failed Quest'},		
		{ id:'3', name: 'NOT Active Quest'},
		{ id:'4', name: 'NOT Completed Quest'},
		{ id:'5', name: 'NOT Failed Quest'},
		{ id:'6', name: 'Has Quest (any status)'},
		{ id:'7', name: 'NOT Have Quest (any status)'}		
    ];

    return {
        questStatus: questStatus,
        getQuestStatusById: function(id) {
            if (typeof id !== 'undefined') {
                 return questStatus[parseInt(id)].name;
            }
        }
    };
});
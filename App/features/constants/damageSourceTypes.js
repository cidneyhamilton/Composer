define(function(require) {

	var damageSource = [
		{ id:'0', name: 'Physical'},
		{ id:'1', name: 'Magical'},
		{ id:'2', name: 'Fire'},
		{ id:'3', name: 'Undead'},
		{ id:'4', name: 'Poison'},
		{ id:'5', name: 'Water'},
        { id:'6', name: 'DrainLife'}
    ];

    var alwaysHit = [
		{ id:'0', name: 'No'},
		{ id:'1', name: 'Always'}
    ];

    return {
        damageSource: damageSource,
        getDamageSourceById: function(id) {
            if (typeof id !== 'undefined') {
                 return damageSource[parseInt(id)].name;
            }
        },
        alwaysHit: alwaysHit,
        getAlwaysHitById: function(id) {
            if (typeof id !== 'undefined') {
                 return alwaysHit[parseInt(id)].name;
            }
        }
    };
});
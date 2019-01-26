define(function(require) {

	var heroStatusEffects = [
		{ id:'0', name: 'None'},
		{ id:'1', name: 'Attract Monsters'},
		{ id:'2', name: 'Blind'},
		{ id:'3', name: 'Reduce Attack'},
		{ id:'4', name: 'Put To Sleep'},
		{ id:'5', name: 'Poison'},
		{ id:'6', name: 'Set On Fire'},
		{ id:'7', name: 'Paralyze'},
		{ id:'8', name: 'Repel Undead'},
		{ id:'9', name: 'Spawn Ring Of Fire'}
    ];


    return {
        statusEffects: heroStatusEffects,
        getStatusEffectById: function(id) {
            if (typeof id !== 'undefined') {
                 return heroStatusEffects[parseInt(id)].name;
            }
        }
    };
});
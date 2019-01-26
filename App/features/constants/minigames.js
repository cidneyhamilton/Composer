define(function(require) {

	var minigames = [
		{ id:'0', name: 'Placeholder'},
		{ id:'1', name: 'Disarm Trap'},
		{ id:'2', name: 'Shield Puzzle'},

        // Poobah should use the "Play Poobah" configuration
		// { id:'3', name: 'Poobah'},
        { id:'4', name: 'PuzzleFloor'},
        { id:'5', name: 'CompassPuzzle'}
    ];

    var poobahPlayers = [
        { id:'0', name: 'None'},
        { id:'1', name: 'Aeolus'},
        { id:'2', name: 'Esme'},
        { id:'3', name: 'Joel'},
        { id:'4', name: 'Sosi'},
        { id:'5', name: 'Thomas'},
        { id:'6', name: 'Katie'},
        { id:'7', name: 'Pirate Captain'}
    ];

    return {
        minigames: minigames,

        poobahPlayers: poobahPlayers,

        getMinigameById: function(id) {
            if (typeof id !== 'undefined') {
                var intId = parseInt(id);
                if (intId > 3) {
                    // Total hack for removing Poobah
                    intId--;
                }
                return minigames[intId].name;
            }
        },

        getPoobahPlayerById: function(id) {
            if (typeof id !== 'undefined') {
                return poobahPlayers[id].name;
            }
        }
    };
});
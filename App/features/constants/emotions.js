define(function(require) {

	var emotions = [
	    { id:'0', name: 'Neutral'},
	    { id:'1', name: 'Happy'},
	    { id:'2', name: 'Sad'},
	    { id:'3', name: 'Angry'},
	    { id:'4', name: 'Surprised'},
	    { id:'5', name: 'Special'},
            { id:'6', name: 'Boggled'},
	    { id:'7', name: 'Gloating'},
	    { id:'8', name: 'Singing'},
	    { id:'9', name: 'Laughing'},
	    { id:'10', name: 'Shouting'},
	    { id:'11', name: 'Whispering'}
    ];

	var devices = [
		{ id:'0', name: 'Default'},
		{ id:'1', name: 'Interior Monologue'}
    ];

    return {
        emotions: emotions,
        getEmotionById: function(id) {
            if (typeof id !== 'undefined') {
                 return emotions[parseInt(id)].name;
            }
        },

        devices: devices,
        getDeviceById: function(id) {
            if (typeof id !== 'undefined') {
                 return devices[parseInt(id)].name;
            }
        }
    };
});

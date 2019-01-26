define(function(require) {

    var skills = { 
        group: 'Skills',
        options: ['Combat', 'Defense', 'Stealth', 'Tool Use', 'Climbing', 'Throwing', 'Traps', 'Gotcha', 'Spot', 'Listen', 'Gaming']
    };
    var atts =  {
        group: 'Attributes',
        options: ['Agility', 'Charm', 'Fitness', 'Magic', 'Perception', 'Smarts', 'Moxie', 'Luck']
    };


    var skillOrStats = [
        { id:'0', name: 'None'},
        { id:'1', name: 'All'},
        { id:'2', name: 'AllSkills'},
        { id:'3', name: 'AllStats'},
        { id:'4', name: 'Climbing'},
        { id:'5', name: 'Combat'},
        { id:'6', name: 'Defense'},
        { id:'7', name: 'Listen'},
        { id:'8', name: 'Tool Use'},
        { id:'9', name: 'Spot'},
        { id:'10', name: 'Stealth'},
        { id:'11', name: 'Throwing'},
        { id:'12', name: 'Agility'},
        { id:'13', name: 'Charm'},
        { id:'14', name: 'Fitness'},
        { id:'15', name: 'Luck'},
        { id:'16', name: 'Magic'},
        { id:'17', name: 'Moxie'},
        { id:'18', name: 'Perception'},
        { id:'19', name: 'Smarts'}
    ];

    return {
        skills: skills.options,
        attributes: atts.options,
        skillsAndAttributes: [skills, atts],

        skillOrStats: skillOrStats,
        getSkillOrStatById: function(id) {
            if (typeof id !== 'undefined') {
                 return skillOrStats[parseInt(id)].name;
            }
        }
    };
});
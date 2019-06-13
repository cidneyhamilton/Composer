define(function(require) {

    var ctor = function () {
    };

    ctor.prototype.init = function(skillsAndAttributesEntry) {
        var allSkills = { 
            group: 'Skills',
            options: []
        };
        var allAtts =  {
            group: 'Attributes',
            options: []
        };
        this.entries = [];
        this.allEntries = [];

        if (skillsAndAttributesEntry) {
            // If there are SkillsAndStats defined, parse them.
            skillsAndAttributesEntry.open();
            var skillStatEntries = skillsAndAttributesEntry.item.entries;
            for (var i = 0; i < skillStatEntries.length; i ++) {
                // Only add active entries into the mappings
                if (skillStatEntries[i].active) {
                    if ('Skill' === skillStatEntries[i].category[0]) {
                        allSkills.options.push(skillStatEntries[i].name);
                    } else if ('Stat' === skillStatEntries[i].category[0]) {
                        allAtts.options.push(skillStatEntries[i].name);
                    }
                    // Add the thing to the ordered list of active skills and stats.
                    this.entries.push({id: '' + skillStatEntries[i].index, name: skillStatEntries[i].name});
                }
                // Add the thing to the ordered list of all skills and stats.
                this.allEntries.push({id: '' + skillStatEntries[i].index, name: skillStatEntries[i].name});
            }
            skillsAndAttributesEntry.close();
        }

        this.skills = allSkills.options;
        this.stats = allAtts.options;
        this.skillsAndAttributes = [];
        // For readability, only display items that actually have entries
        if (allSkills.options.length > 0) {
            this.skillsAndAttributes.push(allSkills);
        }
        if (allAtts.options.length > 0) {
            this.skillsAndAttributes.push(allAtts);
        }

        return this;
    };

    ctor.prototype.getNameById = function(id) {
        if (typeof id !== 'undefined') {
             return this.allEntries[parseInt(id)].name;
        }
    };

    return new ctor();
});
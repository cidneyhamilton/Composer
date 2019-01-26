define(function (require) {

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.skill = attributes.skill || '';

        // useArticle is unused
        this.useArticle = attributes.useArticle || false;
    };

    ctor.type = 'variables.skillValueName';
    ctor.prototype.displayName = 'Skill Value Name';

    ctor.prototype.getDescription = function(){
    	var desc = "Skill Name: " + this.skill;
        // Commenting out as it is unused 
        /*
		if (this.useArticle) {
			desc += " (Uses Article)";
		}
        */
        return desc;
    }

    return ctor;
});
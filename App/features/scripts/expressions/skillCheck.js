define(function(require){
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.skill = attributes.skill || '';
        this.target = attributes.target || 0;
    };

    ctor.type = 'expressions.skillCheck';
    ctor.displayName = 'Stat Check';

    ctor.prototype.getDescription = function(){
        var desc = '<span class="skill">' +
            this.skill +
            '</span><span> check vs. </span><span>' +
            this.target +
            '.</span>';

        return desc;
    };

    return ctor;
});

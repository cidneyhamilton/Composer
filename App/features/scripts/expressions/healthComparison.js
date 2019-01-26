define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.variableScope = attributes.variableScope || 'script';
        this.variableName = attributes.variableName;
        this.operator = attributes.operator || 'eq';
        this.compareTo = attributes.compareTo;
    };

    ctor.prototype.getDescription = function(){
        var desc = '<span class="variable">' + this.variableName + '</span> is ';

        switch(this.operator){
            case 'eq':
                break;
            case 'gt':
                desc += "greater than ";
                break;
            case 'gte':
                desc += "greater than or equal to ";
                break;
            case 'lt':
                desc += "less than ";
                break;
            case 'lte':
                desc += "less than or equal to ";
                break;
            case 'ne':
                desc += "not ";
                break;
        }

        desc += this.compareTo;

        return desc;
    };

    ctor.type = 'expressions.variableComparison';
    ctor.displayName = 'Variable Comparison';

    return ctor;
});
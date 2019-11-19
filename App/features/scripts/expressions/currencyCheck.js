define(function(require) {
    var ctor = function(attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.currency = attributes.currency || '';
        this.target = attributes.target || 0;
    };

    ctor.type = 'expressions.currencyCheck';
    ctor.displayName = 'Currency Check';

    ctor.prototype.getDescription = function(){
        var desc = '<span class="currency">' +
            this.currency +
            '</span><span> check vs. </span><span>' +
            this.target +
            '.</span>';

        return desc;
    };

	return ctor;
});

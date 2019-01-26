define(function (require) {
    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.left = attributes.left || null;
        this.right = attributes.right || null;
    };

    ctor.prototype.getDescription = function () {
        if (this.type == 'expressions.or') {
            return (this.left ? this.left.getDescription() : '???') + ' or ' + (this.right ? this.right.getDescription() : '???');
        }

        return (this.left ? this.left.getDescription() : '???') + ' and ' + (this.right ? this.right.getDescription() : '???');
    };

    ctor.type = 'expressions.or';
    ctor.displayName = 'OR';

    return ctor;
});
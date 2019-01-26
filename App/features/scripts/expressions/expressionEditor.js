define(function(require) {
    var ExpressionDialog = require('./expressionDialog');

    var ctor = function() {};

    ctor.prototype.activate = function(owner, mode){
        this.mode = mode;
        this.owner = owner;
        this.description = owner.expression && owner.expression.getDescription();
    };

    ctor.prototype.edit = function(){
        var that = this;
        ExpressionDialog.show(this.owner).then(function(description){
            that.description = description;
        });
    };

    return ctor;
});
define(function(require) {
    var dialog = require('plugins/dialog'),
        model = require('plugins/model');

    var ctor = function() { };

    ctor.prototype.activate = function(owner, expression){
        this.owner = owner;
        this.expression = expression;
    };

    ctor.prototype.remove = function(){
        var that = this;
        dialog.showMessage('Are you sure you want to remove this item?', 'Remove', ['Yes', 'No']).then(function(result){
            if(result == 'Yes'){
                var seq =  that.owner.sequence;
                var index = seq.indexOf(that.expression);
                var removeOther;

                seq.remove(that.expression);

                if(index == 0){  //first
                    removeOther = seq[0];
                }else if(index == seq.length){ //last
                    removeOther = seq[seq.length - 1];
                }else{ //middle
                    removeOther = seq[index];
                }

                if(removeOther && (removeOther.type == 'expressions.and' || removeOther.type == 'expressions.or')){
                    seq.remove(removeOther);
                }
            }
        });
    };

    ctor.baseOn = function(s) {
        model.baseOn(s, ctor);
    };

    return ctor;
});
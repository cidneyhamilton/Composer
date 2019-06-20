define(function(require){
    var dialog = require('plugins/dialog'),
        registry = require('./registry'),
        And = require('./and'),
        Editor = require('../editor'),
        selectedGame = require('features/projectSelector/index');

    function sequenceExpressions(seq, exp){
        if(!exp){
            return;
        }

        if(exp.type == 'expressions.and' || exp.type == 'expressions.or'){
            seq.push(exp.left);
            seq.push(exp);
            sequenceExpressions(seq, exp.right);
        }else{
            seq.push(exp);
        }
    }

    function composeExpressions(seq){
        var index = seq.length - 1;
        var left = seq[index];

        while(index > 0){
            var current = seq[index - 1];

            if(current && (current.type == 'expressions.and' || current.type == 'expressions.or')){
                current.right = left;
                current.left = seq[index - 2];
                left = current;
                index -= 2;
            }
        }

        return left;
    }

    var Modal = function(owner){
        this.owner = owner;
        this.sequence = [];

        var expressions;
        if (selectedGame.showAdvanced) {
            expressions = registry.addableExpressions;
        } else {
            expressions = registry.baseExpressions;
        }
        this.availableExpressions = expressions.map(function(item){
            return {
                displayName:item.displayName,
                ctor:item
            }
        });

        sequenceExpressions(this.sequence, owner.expression);
    };

    Modal.prototype.ok = function(){
        var result = composeExpressions(this.sequence);
        this.owner.expression = result;
        dialog.close(this, this.owner.expression && this.owner.expression.getDescription());
    };

    Modal.prototype.addExpression = function(Expression){
        var last = this.sequence[this.sequence.length - 1];

        if(last && last.type !== 'expressions.and' && last.type != 'expressions.or'){
            this.sequence.push(new And());
        }

        var instance = new Expression.ctor();

        if(instance.sceneId === null){
            instance.sceneId = Editor.currentScript.sceneId;
        }

        this.sequence.push(instance);
    }

    Modal.show = function(owner){
        return dialog.show(new Modal(owner));
    };

    return Modal;
});
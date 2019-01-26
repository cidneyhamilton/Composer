define(function(require) {
    var assetDatabase = require('infrastructure/assetDatabase'),
        observable = require('plugins/observable'),
        NodeEditor = require('./nodeEditor'),
        Editor = require('features/shared/editor');

    var ctor = function() {
        NodeEditor.call(this);

        this.actors = assetDatabase.actors.entries;
        
        // NOTE: (Joshua) It's important these names are exactly the same as the bools/triggers in Unity
        this.animations = [
            "CastSpell",
			"ClimbDismount",
			"ComposerCombat", //NOTE from Carolyn: The Composer set of combat actions is for PlayAnimation only.
			"ComposerSlash", //Not to be confused with the actual combat actions for the combat system.
			"ComposerStab",
            "Dodge",
            "Drink",
            "Exhausted",
            "Hurt",
            "JumpScare",
            "KneelDown",
            "KneelUp",
            "Loot",
            "ReachOut",
            "Recovering",
            "SenseMagicYes",
            "SenseMagicNo",
            "Sit Down",
            "Sitting",
            "Slash",
            "Stab",
            "Stand Up",
            "Throwing",
			"ThrowKnife",
			"TightropeFall",
			"TightropeFlail",
			"TightropePause",
			"Triumphant",
            "Use Potion",
			"Fall Down",
            "Bark",          // Wolf only
            "Eat",
            "Taunt"
            ];

        observable.defineProperty(this, 'actor', function(){
            var actorId = this.node.actorId;
            var results = this.actors.filter(function(item){
                return item.id == actorId;
            });

            return results[0] || { name:'???' };
        });

        observable.defineProperty(this, 'animation', function(){    
            var name = this.node.animationName;

            var results = this.animations.filter(function(item){
                return item == name;
            });

             return results[0] || '???';
        });

    };

    NodeEditor.baseOn(ctor);

    return ctor;
});
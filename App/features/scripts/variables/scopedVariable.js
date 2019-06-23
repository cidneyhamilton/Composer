define(function (require) {

    var assetDatabase = require('infrastructure/assetDatabase');

    var ctor = function (attributes) {
        attributes = attributes || {};

        this.type = ctor.type;
        this.name = attributes.name || '';
        this.scope = attributes.scope || 'script';
        this.scopeId = attributes.scopeId;
        this.sceneId = attributes.sceneId;
    };

    ctor.type = 'variables.scopedVariable';
    ctor.prototype.displayName = 'Variable Value';

    ctor.prototype.getDescription = function(){
    	var desc = "Variable value: '" + this.name + "'";			
				
		var that = this;
				
        if (this.scope == 'prop') 
		{
			desc += " from prop ";
            if (that.scopeId == null) 
			{
                desc += "Undefined";
            } 
			else 
			{
                var prop = assetDatabase.props.lookup[that.scopeId];
                desc += '(' + (prop ? prop.name : that.scopeId) + ')';

                if (that.sceneId == null) {
                    desc += " in Undefined"
                } else {
                    var scene = assetDatabase.scenes.lookup[that.sceneId];

                    desc += ' in (' + (scene ? scene.name : that.sceneId) + ')';
                }
            }
        }
		else
		{
			desc += '(' + this.scope + 'scope )';
		}
		
        return desc;
    }

    return ctor;
});
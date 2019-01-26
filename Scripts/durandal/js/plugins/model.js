define(['durandal/system'], function(system) {
    var slice = Array.prototype.slice;

    function baseOn(d, b) {
        function __() {
            this.constructor = d;
        }

        __.prototype = b.prototype;

        d.prototype = new __();
    }

    function extend(target) {
        var sources = slice.call(arguments, 1);

        for (var i = 0; i < sources.length; i++) {
            var currentSource = sources[i];
            if (currentSource) {
                for (var prop in currentSource) {
                    target[prop] = currentSource[prop];
                }
            }
        }

        return target;
    }

    var model = function(def) {
        var defaults = { };

        if(def.include && !system.isArray(def.include)) {
            def.include = [def.include];
        }

        extend(defaults, def.observables, def.properties);

        var ctor = function(attributes) {
            attributes = attributes || { };

            if(def.baseOn) {
                def.baseOn.call(this, attributes);
            }

            if(def.include) {
                for(var i = 0; i < def.include.length; i++) {
                    var current = def.include[i];
                    if(current.includeIn) {
                        current.includeIn(this);
                    } else {
                        extend(this, current);
                    }
                }
            }

            extend(this, defaults, attributes);

            if(def.initialize) {
                def.initialize.apply(this, arguments);
            }

            if (def.observables) {
                
            }

            if (def.computed) {
                
            }
        };

        if(def.basedOn) {
            baseOn(ctor, def.basedOn);
        }

        if(def.methods) {
            for(var key in def.methods) {
                ctor.prototype[key] = def.methods[key];
            }
        }

        if(def.shared) {
            for(var key in def.shared) {
                ctor[key] = def.methods[key];
            }
        }

        return ctor;
    };

    model.baseOn = baseOn;
    model.extend = extend;
    model.define = model;

    return model;
});
define(function() {
    var ctor = function(name, iconClass, moduleId) {
        this.name = name;
        this.iconClass = iconClass;
        this.isSelected = false;
        this.moduleId = moduleId || 'features/' + name.toLowerCase() + '/index';
    };

    return ctor;
});
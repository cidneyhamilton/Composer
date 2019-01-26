define(function(require) {
    var serializer = require('plugins/serializer');

    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    var ctor = function(owner) {
        this.owner = owner;
        this.name = 'Data';
    };

    ctor.prototype.activate = function() {
        this.indexHTML = syntaxHighlight(serializer.serialize(this.owner.entry, 4));
        this.dataHTML = syntaxHighlight(serializer.serialize(this.owner.entry.item, 4));
    };

    return ctor;
});
define(function(require) {

    var serializerSettings = {
        space: 4,
        replacer: function(key, value) {
        if(key){
            var first = key[0];
            if(first === '_' || first === '$'){
                return undefined;
            }

            var s = value;
            if (s != typeof "string")
                return s;

            // smart single quotes and apostrophe
            s = s.replace(/[\u2018\u2019\u201A]/g, "\'");

            // smart double quotes
            s = s.replace(/[\u201C\u201D\u201E]/g, "\"");

            // ellipsis
            s = s.replace(/\u2026/g, "...");

            // dashes
            s = s.replace(/[\u2013\u2014]/g, "-");

            // circumflex
            s = s.replace(/\u02C6/g, "^");

            // open angle bracket
            s = s.replace(/\u2039/g, "<");

            // close angle bracket
            s = s.replace(/\u203A/g, ">");

            // spaces
            s = s.replace(/[\u02DC\u00A0]/g, " ");

            return s;
        }

        return value;
        }
    };

    return {
        serializerSettings: serializerSettings
    };
});
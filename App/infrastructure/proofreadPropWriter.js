define(function(reqire){
    var fs = requireNode('fs'),
        events = requireNode('events');

    var sys;
    try {
        sys = requireNode('util');
    } catch (e) {
        sys = requireNode('sys');
    }

    var newline = "\r\n<br/>\r\n";

    function _htmlEscape(out, itemToWrite) {
        if (itemToWrite) {
            out.push(itemToWrite.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        }
    }

    function _writeItemStart(out) {
        out.push("<li>");
    }

    function _writeItemEnd(out) {
        out.push("</li>\r\n");
    }

    function _writeItemListStart(out, hideStyle) {
        out.push("<ul");
        if (hideStyle) {
            out.push(" class=\"hideStyle\"");
        }
        out.push(">\r\n");
    }

    function _writeItemListEnd(out) {
        out.push("</ul>\r\n");
    }

    function _writeComponent(out, comp) {
        out.push(comp.type + newline);
        _writeItemListStart(out, false);
        Object.keys(comp).sort(function(a,b){return a.localeCompare(b)}).forEach(function(propertyName) {            
            // skip any system properties
            if (propertyName.indexOf("__") != -1) {
                return;
            }
            // skip Type; we've displayed that separately
            if ("type" == propertyName) {
                return;
            }
            _writeItemStart(out);
            out.push(propertyName + ': ' + comp[propertyName]);
            _writeItemEnd(out);

        });
        _writeItemListEnd(out);
    }

	function _writeComponents(out, item) {
		for (var i = 0; i < item.components.length; i++) {
			var comp = item.components[i];
			_writeItemStart(out);
			_writeComponent(out, comp);
			_writeItemEnd(out);
		}
	}

    function _writeDetails(out, item) {
        out.push("<div class=\"right\">\r\n");
        _writeItemListStart(out, true);
        _writeItemStart(out);
        out.push("<b>Display Name</b>: " + ( !!item.displayName ? item.displayName : (item.name + ' (same as name)')));
        _writeItemEnd(out);
        if (item.description) {
        	_writeItemStart(out);
        	out.push("<b>Description</b>: " + item.description + "\r\n");
        	_writeItemEnd(out);
    	}
        if (item.components) {
            out.push("<hr/>\r\n");
        	_writeComponents(out, item);
        }
        _writeItemListEnd(out);
        out.push("</div>\r\n");
    }

    function _writeitems(writer, scene, items) {
        var out = [];
        for (var i = 0; i < items.length; i++) {
        		var item = items[i];
                out.push("<section>\r\n");
                out.push("<div class=\"left\">\r\n");
                out.push("<div class=\"floater\">" );
                if (scene) {
                    out.push("<b>Scene</b>: " + scene + newline);
                }
                out.push("<b>" + writer.itemType + " Name</b>: " + item.name + newline);
                out.push("<b>" + writer.itemType + " Id</b>: " + item.id + newline);
                out.push("</div>\r\n");
                out.push("</div>\r\n");
                _writeDetails(out, item);
                out.push("<div class=\"clear\"></div>\r\n");
                out.push("</section>\r\n");
        }
        writer.writeStream.write(out.join(''), this.encoding);
    }

    var ctor = function(writeStream, type) {
        this.writeStream = writeStream;
        this.encoding = 'utf8';
        this.itemType = type;

        if (typeof writeStream.setEncoding === 'function') {
            writeStream.setEncoding(this.encoding);
        }

        writeStream.addListener('drain', this.emit.bind(this, 'drain'));
        writeStream.addListener('error', this.emit.bind(this, 'error'));
        writeStream.addListener('close', this.emit.bind(this, 'close'));
    };

    sys.inherits(ctor, events.EventEmitter);

    ctor.prototype.writeHtmlHeader = function() {
        this.writeStream.write("<!DOCTYPE html>\r\n" 
            + "<html>\r\n"
            + "<head>\r\n"
            + "<meta charset=\"UTF-8\">"
            + "<title>" + this.itemType + "s for Hero-U: Rogue to Redemption (Proofread)</title>\r\n"
            + "<link rel=\"stylesheet\" href=\"game_text.css\"/>\r\n"
            + "</head>\r\n" 
            + "<body>\r\n"
            + "<script src=\"jquery-1.11.3.min.js\"></script>\r\n"
            + "<script src=\"jquery.viewport.mini.js\"></script>\r\n"
            + "\r\n"
            , this.encoding);
    };

    ctor.prototype.writeHtmlFooter = function() {
        this.writeStream.write(
            "</body>\r\n</html>"
            , this.encoding);
    };

    ctor.prototype.writeScene = function(scene, items) {
        if (!items) return; // ignore scenes without items
        if (!Array.isArray(items)) {
            throw new Error("proofreadWriter.writeScene() expects a " + this.itemType + " array!");
        }
        this.writeStream.write(
              "<article>\r\n", this.encoding);
        _writeitems(this, scene, items);
        this.writeStream.write(
              "</article>\r\n", this.encoding);

    };

    ctor.prototype.end = function(){
        this.writeStream.end();
    };

    ctor.createFileWriter = function(path, type) {

        var writeStream = fs.createWriteStream(path, {
            'flags': 'w'
        });

        var writer = new ctor(writeStream, type);


        return writer;
    };

    return ctor;
});
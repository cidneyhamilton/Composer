$(window).load(function () {

    $(window).scroll(function () {

        var scroll = $(this).scrollTop();

		$('.left:in-viewport').each(function(i) {

			// We only want to animate if there's anythign to float.
			// If the floated text is the same size as the left nav, it'll never move.
			if ($(this).height() == $(this).children(".floater").first().height()) {
				return true;
			}

	    	var length = $(this).height() - $(this).children(".floater").first().height() + $(this).offset().top;

		    var height = $(this).children(".floater").first().height() + 'px';

			// If we're at the top of the parent, stay at the top.
		    if (scroll < $(this).offset().top) {

		        $(this).children(".floater").first().css({
		            'position': 'absolute',
		            'top': '0',
		        });
			
			// If it's gone past the parent, hug the bottom edge
		    } else if (scroll > length) {
		        $(this).children(".floater").first().css({
		            'position': 'absolute',
		            'bottom': '0',
		            'top': 'auto'
		        });
			// Let it float, let it float, the css never bothered me anyway.
		    } else {
		        $(this).children(".floater").first().css({
		            'position': 'fixed',
		            'top': '0',
		            'height': height
		        });
		    }
		});
    });
});

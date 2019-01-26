/*
 * jQuery Touchable
 *
 * Simplified BSD License (@see License)
 * @author        Gregor Schwab
 * @copyright     (c) 2010 Gregor Schwab
 * Usage Command Line: $(elem).Touchable() (@see Readme.md)
 * @version 0.0.5
 * @requires jQuery
 */
(function($) {
    var touchSupported = false;
    
    $.fn.Touchable = function() {
        return this.each(function() {
            var t = $(this).data['Touchable'] = new Touchable(this);
            return t;
        });
    };

    $.Touchable = Touchable;

    function Touchable(elem) {
        function touchstart(e) {
            if(touchSupported) {
                //only handle 1 or 2 touches
                if(e.originalEvent.touches.length !== 1 && e.originalEvent.touches.length !== 2) {
                    return false;
                }

                if(self.isCurrentlyTouching) {
                    return false;
                }

                self.isCurrentlyTouching = true;

                if(e.originalEvent.touches.length == 1) { //1 finger
                    self.isOneFingerGesture = true;
                    //init pos
                    self.startTouch.x = self.previousTouch.x = e.originalEvent.touches[0].clientX;
                    self.startTouch.y = self.previousTouch.y = e.originalEvent.touches[0].clientY;

                } else if(e.originalEvent.touches.length == 2) { //two fingers
                    self.isOneFingerGesture = false;

                    if(e.originalEvent.touches[0].clientY > e.originalEvent.touches[1].clientY) { //0 is lower
                        self.startTouch.x = self.previousTouch.x = e.originalEvent.touches[0].clientX;
                        self.startTouch.y = self.previousTouch.y = e.originalEvent.touches[0].clientY;
                    } else {
                        self.startTouch.x = self.previousTouch.x = self.touches[1].clientX;
                        self.startTouch.y = self.previousTouch.y = self.touches[1].clientY;
                    }
                }

                $(document).bind('touchmove', touchmove);
                $(document).bind('touchend', touchend);
            } else {
                self.startTouch.x = self.previousTouch.x = e.pageX;
                self.startTouch.y = self.previousTouch.y = e.pageY;
                
                $(document).bind('mousemove', touchmove);
                $(document).bind('mouseup', touchend);
            }

            //don't shallow links, but all the rest
            self.target = e.target; //some browser loose the info here
            self.currentTarget = e.currentTarget; //some browser loose the info here so save it for later
            var x = self.startTouch.x;
            var y = self.startTouch.y;
            self.hitTarget = (document.elementFromPoint) ? (document.elementFromPoint(x, y)) : '';

            //setup double tapping
            if(!self.inDoubleTap) {
                self.inDoubleTap = true;
                //setup a timer
                self.doubleTapTimer = setTimeout(function() {
                    self.inDoubleTap = false;
                }, 500);
            } else { //we are double tapping
                // call function to run if double-tap
                self.$elem.trigger('doubleTap', self); //trigger a doubleTap
                //reset doubleTap state
                clearTimeout(self.doubleTapTimer);
                self.inDoubleTap = false;
            }

            //setup long tapping and long mousedown
            //setup a timer
            self.longTapTimer = setTimeout(function() {
                $(self.elem).trigger('longTap', self); //trigger a longTap
            }, 1000);

            $(self.elem).trigger('tap', self); //trigger a tap
            $(self.elem).trigger('touchablestart', self); //trigger a tap
        }

        //called on iPad/iPhone when touches started and the finger is moved
        function touchmove(e) {
            if (touchSupported) {
                e.preventDefault();
                
                if(e.originalEvent.touches.length !== 1 && e.originalEvent.touches.length !== 2) { //use touches to track all fingers on the screen currently (also the ones not in the pane) if there are more than 2 its a gesture
                    return false;
                }

                //1 finger
                if(e.originalEvent.touches.length == 1 || self.isOneFingerGesture) { //we ignore the second finger if we are already in movement
                    self.currentTouch.x = e.originalEvent.touches[0].clientX;
                    self.currentTouch.y = e.originalEvent.touches[0].clientY;
                } else if(e.originalEvent.touches.length == 2 && !self.isOneFingerGesture) { //two fingers move , take the upper finger as reference
                    if(e.originalEvent.touches[0].clientY > e.originalEvent.touches[1].clientY) { //0 is lower
                        self.currentTouch.x = e.originalEvent.touches[0].clientX;
                        self.currentTouch.y = e.originalEvent.touches[0].clientY;
                    } else {
                        self.currentTouch.x = e.originalEvent.touches[1].clientX;
                        self.currentTouch.y = e.originalEvent.touches[1].clientY;
                    }
                }
            } else {
                e.preventDefault();
                
                self.currentTouch.x = e.pageX;
                self.currentTouch.y = e.pageY;
            }

            //if we are moving stop any css animations currently running
            $(self.elem).removeClass('webkitAnimate');
            self.currentDelta.x = (self.currentTouch.x - self.previousTouch.x);
            ///s.currentScale;
            self.currentDelta.y = (self.currentTouch.y - self.previousTouch.y);
            ///s.currentScale;
            self.currentStartDelta.x = (self.currentTouch.x - self.startTouch.x);
            ///s.currentScale;
            self.currentStartDelta.y = (self.currentTouch.y - self.startTouch.y);
            ///s.currentScale;
            //just for the records (accumulation)
            self.currentPosition.x = self.currentPosition.x + self.currentDelta.x;
            self.currentPosition.y = self.currentPosition.y + self.currentDelta.y;
            //reset the start position for the next delta
            self.previousTouch.x = self.currentTouch.x;
            self.previousTouch.y = self.currentTouch.y;
            //Target handling
            self.target = e.target; //some browser loose the info here
            self.currentTarget = e.currentTarget; //some browser loose the info here so save it for later
            var x = self.currentTouch.x;
            var y = self.currentTouch.y;
            self.hitTarget = (document.elementFromPoint) ? (document.elementFromPoint(x, y)) : '';
            $(self.elem).trigger('touchablemove', self);

            //clear the long tap timer on mousemove
            if(self.longTapTimer) {
                clearTimeout(self.longTapTimer);
            }
        }

        function touchend(e) {
            if(touchSupported) {
                if(e.originalEvent.targetTouches.length > 0) {
                    return false;
                }

                $(document).unbind('touchmove', touchmove);
                $(document).unbind('touchend', touchend);
            } else {
                $(document).unbind('mousemove', touchmove);
                $(document).unbind('mouseup', touchend);
            }

            self.isCurrentlyTouching = false;

            //clear the long tap timer on mouseup
            if(self.longTapTimer) {
                clearTimeout(self.longTapTimer);
            }

            $(self.elem).trigger('touchableend', self);
        }

        this.elem = elem;
        this.$elem = $(elem);
        this.is_doubleTap = false;
        this.is_currentlyTouching = false;
        this.isOneFingerGesture = false;
        this.startTouch = { x:0, y:0 };
        this.currentTouch = { x:0, y:0 };
        this.previousTouch = { x:0, y:0 };
        this.currentDelta = { x:0, y:0 }; //measured from previous move event
        this.currentStartDelta = { x:0, y:0 }; //measured from start
        this.currentPosition = { x:0, y:0 };
        this.doubleTapTimer = null;
        this.longTapTimer = null;
        this.touchStartSupported = false;

        var self = this;

        if(touchSupported) {
            this.$elem.bind('touchstart', function(e) {
                self.touchStartSupported = true;
                touchstart(e);
                return false;
            });
        } else {
            this.$elem.bind('mousedown', function(e) {
                touchstart(e);
                return false;
            });
        }
    }
})(jQuery);
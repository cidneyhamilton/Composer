define(function(require) {
    // setup transform (translate only) function
    var _translateFunction;
    var _translateStringBuilder3D = ['translate3d(', '', 'px,', '', 'px, 0)'];

    _translateFunction = function(left, top, element) {
        _translateStringBuilder3D[1] = left;
        _translateStringBuilder3D[3] = top;
        element.style.webkitTransform = _translateStringBuilder3D.join('');
    };

    // setup transform matrix function
    var _transformFunction;
    var _transformStringBuilder3D = ['matrix3d(', '', ',0,0,0,0,', '', ',0,0,0,0,1,0,', '', ',', '', ',0,1)'];
    var _rotateFunction;

    _transformFunction = function(scaleX, scaleY, left, top, element) {
        _transformStringBuilder3D[1] = scaleX;
        _transformStringBuilder3D[3] = scaleY;
        _transformStringBuilder3D[5] = left;
        _transformStringBuilder3D[7] = top;
        element.style.webkitTransform = _transformStringBuilder3D.join('');
    };

    _rotateFunction = function(degrees, element) {
        element.style.webkitTransform = 'rotate(' + degrees + 'deg)';
    };

    return {
        translate: _translateFunction,
        transform: _transformFunction,
        rotate: _rotateFunction
    };
});
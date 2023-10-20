function CMalus(iX, iY, iPoints) {
    var _iX;
    var _iY;
    var _iPoints;
    
    var _oTextStroke;
    var _oText;
    
    var _oThis;
    
    this._init = function () {
        _iX = iX;
        _iY = iY;
        _iPoints = iPoints;
        
        _oTextStroke = new createjs.Text(sprintf(TEXT_PTS, _iPoints)," 20px "+PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oTextStroke.x = _iX;
        _oTextStroke.y = _iY;
        _oTextStroke.textAlign = "center";
        _oTextStroke.textBaseline = "alphabetic";
        _oTextStroke.outline = 4;

        _oText = new createjs.Text(sprintf(TEXT_PTS, _iPoints)," 20px "+PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oText.x = _oTextStroke.x;
        _oText.y = _oTextStroke.y;
        _oText.textAlign = _oTextStroke.textAlign;
        _oText.textBaseline = _oTextStroke.textBaseline;
        s_oStage.addChild(_oTextStroke, _oText);
        
        var iSpeed = 800;
        
        new createjs.Tween.get(_oTextStroke)
            .to({y: 0, alpha: 0}, iSpeed, createjs.Ease.cubicIn)
        new createjs.Tween.get(_oText)
            .to({y: 0, alpha: 0}, iSpeed, createjs.Ease.cubicIn)
            .call(this.unload);
    };
    
    this.unload = function () {
        _oTextStroke = null;
        _oText = null;
        _oThis = null;
    };

    _oThis = this;

    this._init();
}
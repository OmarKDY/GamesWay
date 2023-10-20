function CScoreBoard(oParentContainer) {

    var _pContainerPos;
    var _iStartSubY;
    var _oScoreText;
    var _oScoreTextStroke;
    var _oPointText;
    var _oPointTextStroke;
    var _oBestTextStroke;
    var _oBestText;
    var _oAddScoreText;
    var _oAddScoreTextStroke;
    var _oRollingScore;
    var _oParentContainer = oParentContainer;
    var _oContainer;
    var _oContainerAdd;

    this._init = function () {

        _pContainerPos = {x: 10, y: CANVAS_HEIGHT - 10};
        _oContainer = new createjs.Container();
        _oContainer.x = _pContainerPos.x;
        _oContainer.y = _pContainerPos.y;
        _oParentContainer.addChild(_oContainer);
        
        _oScoreTextStroke = new createjs.Text(TEXT_SCORE, "70px " + FONT_GAME, TEXT_COLOR_STROKE);
        _oScoreTextStroke.textAlign = "left";
        _oScoreTextStroke.outline = 4;
        _oContainer.addChild(_oScoreTextStroke);
        
        _oScoreText = new createjs.Text(TEXT_SCORE, "70px " + FONT_GAME, TEXT_COLOR);
        _oScoreText.textAlign = "left";
        _oContainer.addChild(_oScoreText);

        _oPointTextStroke = new createjs.Text(0, "70px " + FONT_GAME, TEXT_COLOR_STROKE);
        _oPointTextStroke.textAlign = "left";
        _oPointTextStroke.x = 200;
        _oPointTextStroke.outline = 4;
        _oContainer.addChild(_oPointTextStroke);

        _oPointText = new createjs.Text(0, "70px " + FONT_GAME, TEXT_COLOR);
        _oPointText.textAlign = "left";
        _oPointText.x = 200;
        _oContainer.addChild(_oPointText);

        _oBestTextStroke = new createjs.Text(TEXT_BEST+ " "+s_iBestScore, "70px " + FONT_GAME, TEXT_COLOR_STROKE);
        _oBestTextStroke.y = 60;
        _oBestTextStroke.textAlign = "left";
        _oBestTextStroke.outline = 4;
        _oContainer.addChild(_oBestTextStroke);
        
        _oBestText = new createjs.Text(TEXT_BEST+ " "+s_iBestScore, "70px " + FONT_GAME, TEXT_COLOR);
        _oBestText.y = 60;
        _oBestText.textAlign = "left";
        _oContainer.addChild(_oBestText);

        
        
        _oContainerAdd = new createjs.Container();
        _oContainerAdd.x = 50;

        _oAddScoreText = new createjs.Text("+5555 " + TEXT_MULTIPLIER + 1, "36px " + FONT_GAME, TEXT_COLOR);
        _oAddScoreText.textAlign = "left";

        _oContainerAdd.addChild(_oAddScoreText);

        _oAddScoreTextStroke = new createjs.Text("+5555 " + TEXT_MULTIPLIER + 1, "36px " + FONT_GAME, TEXT_COLOR_STROKE);
        _oAddScoreTextStroke.textAlign = "left";
        _oAddScoreTextStroke.outline = OUTLINE_WIDTH;

        _oContainerAdd.addChild(_oAddScoreTextStroke);

        _oContainerAdd.y = _iStartSubY = -_oAddScoreTextStroke.getBounds().height;
        _oContainerAdd.visible = false;

        _oContainer.addChild(_oContainerAdd);
        _oRollingScore = new CRollingScore();
        
        _oContainer.regY = _oContainer.getBounds().height;
    };

    this.getStartPosScore = function () {
        return _pContainerPos;
    };

    this.setPosScore = function (iX, iY) {
        _oContainer.x = iX;
        _oContainer.y = iY;
    };

    this.refreshTextScore = function (iScore) {
        _oRollingScore.rolling(_oPointText, _oPointTextStroke, iScore);
    };
    
    this.refreshBestScore = function(){
        _oBestTextStroke.text = TEXT_BEST+ " "+s_iBestScore;
        _oBestText.text = TEXT_BEST+ " "+s_iBestScore;
    };

    this.effectAddScore = function (iScore, fMultiplier) {
        _oContainerAdd.visible = true;
        _oAddScoreText.text = "+" + iScore + " " + TEXT_MULTIPLIER + fMultiplier;
        _oAddScoreTextStroke.text = _oAddScoreText.text;
        createjs.Tween.get(_oContainerAdd).to({y: _iStartSubY - 50, alpha: 0}, MS_EFFECT_ADD, createjs.Ease.cubicOut).call(function () {
            _oContainerAdd.visible = false;
            _oContainerAdd.alpha = 1;
            _oContainerAdd.y = _iStartSubY;
        });
    };

    this._init();

    return this;
}
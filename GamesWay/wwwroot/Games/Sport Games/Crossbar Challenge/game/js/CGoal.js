function CGoal(iX, iY, oSprite, oParentContainer) {
    var _aCrossBarHighlights;
    var _aPolesLeft;
    var _aPolesRight;
    var _aXPositions;
    var _oGoal;
    var _oContainer;
    var _oParentContainer = oParentContainer;

    this._init = function (iX, iY, oSprite) {
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        
        _oGoal = createBitmap(oSprite);
        this.setPosition(iX, iY);

        _oContainer.addChild(_oGoal);
        
        _aCrossBarHighlights = new Array();
        
        _aXPositions = [1, 88, 175, 262, 349, 436, 523, 610, 697];
        var iFinalPos = _aXPositions[_aXPositions.length-1]+s_oSpriteLibrary.getSprite("horizontal_angle_right").width;
        _aXPositions.push(iFinalPos);
        
        var oHighlight = new CPoleHighlight(true,false,1,_aXPositions[0],CROSSBAR_SCORE[4],s_oSpriteLibrary.getSprite("horizontal_angle"),_oContainer);
        _aCrossBarHighlights.push(oHighlight);
        
        oHighlight = new CPoleHighlight(true,false,_aXPositions[1],1,CROSSBAR_SCORE[3],s_oSpriteLibrary.getSprite("horizontal_orange"),_oContainer);
        _aCrossBarHighlights.push(oHighlight);

        oHighlight = new CPoleHighlight(true,false,_aXPositions[2],1,CROSSBAR_SCORE[2],s_oSpriteLibrary.getSprite("horizontal_yellow"),_oContainer);
        _aCrossBarHighlights.push(oHighlight);
        
        oHighlight = new CPoleHighlight(true,false,_aXPositions[3],1,CROSSBAR_SCORE[1],s_oSpriteLibrary.getSprite("horizontal_orange"),_oContainer);
        _aCrossBarHighlights.push(oHighlight);
        
        oHighlight = new CPoleHighlight(true,false,_aXPositions[4],1,CROSSBAR_SCORE[0],s_oSpriteLibrary.getSprite("horizontal_yellow"),_oContainer);
        _aCrossBarHighlights.push(oHighlight);
        
        oHighlight = new CPoleHighlight(true,false,_aXPositions[5],1,CROSSBAR_SCORE[1],s_oSpriteLibrary.getSprite("horizontal_orange"),_oContainer);
        _aCrossBarHighlights.push(oHighlight);
        
        oHighlight = new CPoleHighlight(true,false,_aXPositions[6],1,CROSSBAR_SCORE[2],s_oSpriteLibrary.getSprite("horizontal_yellow"),_oContainer);
        _aCrossBarHighlights.push(oHighlight);
        
        oHighlight = new CPoleHighlight(true,false,_aXPositions[7],1,CROSSBAR_SCORE[3],s_oSpriteLibrary.getSprite("horizontal_orange"),_oContainer);
        _aCrossBarHighlights.push(oHighlight);
        
        oHighlight = new CPoleHighlight(true,false,_aXPositions[8],1,CROSSBAR_SCORE[4],s_oSpriteLibrary.getSprite("horizontal_angle_right"),_oContainer);
        _aCrossBarHighlights.push(oHighlight);
        
        
        
    };

    this.unload = function () {
        _oParentContainer.removeChild(_oGoal);
    };

    this.setPosition = function (iX, iY) {
        _oContainer.x = iX;
        _oContainer.y = iY;
    };
    
    this.highlightCrossbar = function(iIndex){

        _aCrossBarHighlights[iIndex].highlightAnim();
        
        new CScoreText(_aCrossBarHighlights[iIndex].getText(),_aCrossBarHighlights[iIndex].getTextX(),_aCrossBarHighlights[iIndex].getTextY(),_oContainer);
    };
    
    this.highlightPoleLeft= function(iIndex){

        _aPolesLeft[iIndex].highlightAnim();
        
    };
    
    this.highlightPoleRight = function(iIndex){

        _aPolesRight[iIndex].highlightAnim();
    };

    this.getDepthPos = function () {
        return GOAL_SPRITE_SWAP_Y;
    };

    this.getObject = function () {
        return _oContainer;
    };
    
    this.getPoleIndexByPos = function(iXHit){
        var iXHitPole = iXHit-_oContainer.x;
        
        var iIndex = null;
        for(var i=0; i<_aXPositions.length-1; i++){
            if(_aXPositions[i] <=  iXHitPole && iXHitPole < _aXPositions[i+1]){
                iIndex = i;
                break;
            }
        }
        
        if(iXHitPole<0){
            iIndex = 0;
        }
        if(iXHitPole>_aXPositions[_aXPositions.length-1]){
            
            iIndex = _aCrossBarHighlights.length-1;
        }

        return iIndex;
    };

    this._init(iX, iY, oSprite);

    return this;
}



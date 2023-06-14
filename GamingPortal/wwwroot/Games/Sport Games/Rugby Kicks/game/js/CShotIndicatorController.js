function CShotIndicatorController(iX, iY,bVertical){
	
    var _bShow = true;
    var _bVertical;
    var _iCursorSpeed;
    var _iRange;

    var _oMcContainer;
    var _oBar;
    var _oCursor;
    var _oGreenIndicator1;
    var _oGreenIndicator2;

    var _pBarBorder;
  
    this.init = function(iX, iY,bVertical){

            _oMcContainer=new createjs.Container();
            _oMcContainer.x = iX;
            _oMcContainer.y = iY;
            s_oStage.addChild(_oMcContainer)
            
            _bVertical=bVertical;
            
            if(bVertical === false){
                var oTopBar = s_oSpriteLibrary.getSprite("top_bar");
                _oBar = createBitmap(oTopBar);
                _oBar.regX = oTopBar.width/2;
                _oBar.regY = oTopBar.height/2;
                _oMcContainer.addChild(_oBar);
                
                var iXOffset = 4;
                _pBarBorder = {start: -oTopBar.width/2 + iXOffset, end: oTopBar.width/2 - iXOffset};
                _iRange = (_pBarBorder.end - _pBarBorder.start);
                
                var oCursor = s_oSpriteLibrary.getSprite("arrow_bar");
                _oCursor = createBitmap(oCursor);
                _oCursor.regX = oCursor.width/2;
                _oCursor.regY = oCursor.height/2 + 20;
                _oCursor.x = _pBarBorder.start;
                _oMcContainer.addChild(_oCursor);
                
                var oArrow = s_oSpriteLibrary.getSprite("arrow");
                _oGreenIndicator1 = createBitmap(oArrow);
                _oGreenIndicator1.regX = oArrow.width/2;
                _oGreenIndicator1.regY = 5;
                _oMcContainer.addChild(_oGreenIndicator1);
                
                var oArrow = s_oSpriteLibrary.getSprite("arrow");
                _oGreenIndicator2 = createBitmap(oArrow);
                _oGreenIndicator2.regX = oArrow.width/2;
                _oGreenIndicator2.regY = 5;
                _oMcContainer.addChild(_oGreenIndicator2);
                
            }else{
                var oRightBar = s_oSpriteLibrary.getSprite("right_bar");
                _oBar = createBitmap(oRightBar);
                _oBar.regX = oRightBar.width/2;
                _oBar.regY = oRightBar.height/2;
                _oMcContainer.addChild(_oBar);

                
                _pBarBorder = {start: -oRightBar.height/2 + 1, end: oRightBar.height/2- 6};
                _iRange = (_pBarBorder.end - _pBarBorder.start);

                var oCursor = s_oSpriteLibrary.getSprite("arrow_bar");
                _oCursor = createBitmap(oCursor);
                _oCursor.regX = oCursor.width/2;
                _oCursor.regY = oCursor.height/2+20;
                _oCursor.y = _pBarBorder.start;
                _oCursor.rotation = 90;
                _oMcContainer.addChild(_oCursor);
                
                var oArrow = s_oSpriteLibrary.getSprite("arrow");
                _oGreenIndicator1 = createBitmap(oArrow);
                _oGreenIndicator1.regX = oArrow.width/2;
                _oGreenIndicator1.regY = 4;
                _oGreenIndicator1.rotation = 90;
                _oMcContainer.addChild(_oGreenIndicator1);
                
                var oArrow = s_oSpriteLibrary.getSprite("arrow");
                _oGreenIndicator2 = createBitmap(oArrow);
                _oGreenIndicator2.regX = oArrow.width/2;
                _oGreenIndicator2.regY = 4;
                _oGreenIndicator2.rotation = 90;
                _oMcContainer.addChild(_oGreenIndicator2);
                
            }
            
            this.reset(SHOT_INDICATOR_SPEED);
            
    };
		
    this.reset = function(iSpeed){
        _iCursorSpeed = iSpeed;
        if(_bVertical){
            _oCursor.y = _pBarBorder.start;
        } else {
            _oCursor.x = _pBarBorder.start;
        }
    };

    this.show = function(){
        _bShow=true;
        _oMcContainer.visible=_bShow;
    };

    this.hide = function(){
        _bShow=false;
        _oMcContainer.visible=_bShow;
    };

    this.getCursorPosition = function(){
        var iRes;
        if(_bVertical){
                iRes = (_oCursor.y - _pBarBorder.start)/(_pBarBorder.end - _pBarBorder.start)*2 -1; 
        }else{
                iRes = (_oCursor.x - _pBarBorder.start)/(_pBarBorder.end - _pBarBorder.start)*2 -1; 
        }
        
        return iRes;
    };
    
    this.startAnimation = function(){
        
        
        if(_bVertical){
            new createjs.Tween.get(_oCursor, {loop:true})
                    .to({y: _pBarBorder.start + _iRange*0.5}, _iCursorSpeed/2, createjs.Ease.cubicIn)
                    .to({y: _pBarBorder.end}, _iCursorSpeed*0.5, createjs.Ease.cubicOut)
                    .to({y: _pBarBorder.start + _iRange*0.5}, _iCursorSpeed/2, createjs.Ease.cubicIn)
                    .to({y: _pBarBorder.start}, _iCursorSpeed*0.5, createjs.Ease.cubicOut);
            
        }else{
            new createjs.Tween.get(_oCursor, {loop:true})
                    .to({x: _pBarBorder.start + _iRange*0.5}, _iCursorSpeed/2, createjs.Ease.cubicIn)
                    .to({x: _pBarBorder.end}, _iCursorSpeed*0.5, createjs.Ease.cubicOut)
                    .to({x: _pBarBorder.start + _iRange*0.5}, _iCursorSpeed/2, createjs.Ease.cubicIn)
                    .to({x: _pBarBorder.start}, _iCursorSpeed*0.5, createjs.Ease.cubicOut);
        }
        
    };
    
    
    
    this.setPos = function(iX, iY, oGreenIndicatorPos){
        _oMcContainer.x = iX;
        _oMcContainer.y = iY;
        
        if(!bVertical){
            _oGreenIndicator1.x = oGreenIndicatorPos.horiz.left;
            _oGreenIndicator2.x = oGreenIndicatorPos.horiz.right;
        } else {
            _oGreenIndicator1.y = oGreenIndicatorPos.vert.top;
            _oGreenIndicator2.y = oGreenIndicatorPos.vert.bot;
        }
        
        
    };
    
    this.endAnimation = function(){
        
        new createjs.Tween.removeTweens(_oCursor);

    };

    
    this.init(iX, iY,bVertical);
}
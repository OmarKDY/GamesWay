function CButtonGrid(iRow,iCol,iXPos,iYPos,oSpriteSheet){
    var _bActive;
    var _iRow;
    var _iCol;
    var _iXPos;
    var _iYPos;
    var _iState;
    var _oSprite;
    
    this._init = function(iRow,iCol,iXPos,iYPos,oSpriteSheet){
        _bActive = true;
        _iRow = iRow;
        _iCol = iCol;
        _iXPos = iXPos;
        _iYPos = iYPos;
        _iState = "state_0";

        _oSprite = createSprite(oSpriteSheet,"state_0",0,0,CELL_WIDTH,CELL_HEIGHT);
        _oSprite.stop();
        _oSprite.setTransform(iXPos, iYPos, GRID_SCALE, GRID_SCALE);
        s_oStage.addChild(_oSprite);

        _oSprite.on("pressup" , this.cellRelease); 
        _oSprite.cursor = "pointer";
    };
    
    this.unload = function(){
        _bActive = false;
        _oSprite.off("pressup" , this.cellRelease);
        s_oStage.removeChild(_oSprite);
    };
    
    this.remove = function(){
        this.unload();  
    };
    
    this.setState = function(iState){
        _oSprite.gotoAndStop("state_"+iState);
        _iState = "state_"+iState;
    };
    
    this.cellRelease = function(e){
		if ( s_bMobile=== false && e.nativeEvent.button == 2 ) { 
			//RIGHT CLICK
			s_oGame.cellRightClick(_iRow,_iCol);
			return;
		}
		
		s_oGame.cellClicked(_iRow,_iCol);
    };
    
    this.getState = function(){
        return _iState;
    };
    
    this.isActive = function(){
      return _bActive;  
    };
    
    this._init(iRow,iCol,iXPos,iYPos,oSpriteSheet);
}
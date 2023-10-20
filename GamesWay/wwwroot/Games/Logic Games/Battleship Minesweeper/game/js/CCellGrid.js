function CCellGrid(iXPos,iYPos,oSpriteSheet){
    var _bFlagChecked;
    var _iXPos;
    var _iYPos;
    var _iState;
    var _oSprite;
    
    this._init = function(iXPos,iYPos,oSpriteSheet){
        _bFlagChecked = false;
        _iXPos = iXPos;
        _iYPos = iYPos;
        _iState = "state_0";
        
        _oSprite = createSprite(oSpriteSheet,"state_0",0,0,CELL_WIDTH,CELL_HEIGHT);
        _oSprite.stop();
        _oSprite.setTransform(iXPos, iYPos, GRID_SCALE, GRID_SCALE);
		
        s_oStage.addChild(_oSprite); 
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oSprite);
    };
    
    this.reset = function(){
        _iState = "state_0";
        _oSprite.gotoAndStop(_iState);
    };
    
    this.setChecked = function(){
        _bFlagChecked = true;
    };
    
    this.changeState = function(iState){
        _oSprite.gotoAndStop("state_"+iState);
        _iState = "state_"+iState;
    };
    
    this.putMine = function(){
        _oSprite.gotoAndStop("mine");
        _iState = "mine";
    };
    
    this.getState = function(){
        return _iState;
    };
    
    this.isChecked = function(){
        return _bFlagChecked;
    };
    
    this._init(iXPos,iYPos,oSpriteSheet);
}
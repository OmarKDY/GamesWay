function CPiece (iColor,iStartPosX,iStartPosY,oParentContainer){
    var _oSpriteSheet;
    var _iColor;
    var _iStartPosX;
    var _iStartPosY;
    var _oContainer;
    var _oParentContainer;
    var _pressmove;
    var _pressup;
    var _mousedown;
    var _mouseover;
    
    this.init = function(iColor,iStartPosX,iStartPosY,oParentContainer){
            var oSprite = s_oSpriteLibrary.getSprite("colors");
            var oData = {   // image to use
                            images: [oSprite], 
                            // width, height & registration point of each sprite
                            frames: {width: PIECE_WIDTH, height: PIECE_HEIGHT,regX:PIECE_WIDTH/2,regY:PIECE_HEIGHT/2}, 
                            animations: {  red: [0],blue: [1],yellow: [2],green: [3],pink: [4],black: [5],azure: [6],violet: [7]}
            };
            _oSpriteSheet = new createjs.SpriteSheet(oData);
            
            _iColor = iColor;
            _iStartPosX = iStartPosX;
            _iStartPosY = iStartPosY;
            
            _oContainer = new createjs.Container();
            _oContainer.x = _iStartPosX;
            _oContainer.y = _iStartPosY;
            
            var oColor = createSprite(_oSpriteSheet,_iColor,PIECE_WIDTH/2,PIECE_HEIGHT/2,PIECE_WIDTH,PIECE_HEIGHT);
            oColor.stop();
            
            _oContainer.addChild(oColor);
            
            _oParentContainer = oParentContainer;
            this.initListener();
    };
    
    this.initListener = function(){
        _pressmove = _oContainer.on("pressmove",this.onHolding,this);
        _pressup = _oContainer.on("pressup",this.onRelease,this);
        _mousedown = _oContainer.on("mousedown",this.onClick,this);
        _mouseover = _oContainer.on("mouseover",this.onOver,this);
        createjs.Touch.enable(_oContainer); 
    };
    
    this.getContainer = function(){
       return _oContainer; 
    };
    
    this.setPosition = function(oPos){
        _oContainer.x = oPos.x;
        _oContainer.y = oPos.y;
    };
    
    this.getPosition = function(){
       return {x: _oContainer.x,y: _oContainer.y}; 
    };
    
    this.getGlobalPos = function(){
        return {x: _oContainer.x+_oParentContainer.x,y: _oContainer.y+_oParentContainer.y};
    };
    
    this.onClick = function(){
        _oParentContainer.setChildIndex(_oContainer,_oParentContainer.numChildren-1);
       s_oStage.setChildIndex(_oParentContainer,s_oStage.numChildren-1);
       playSound("click");
       s_oGame.onClickPiece();
    };
    
    this.onHolding = function(evt){
       _oContainer.x+=evt.localX;
       if (s_bMobile===true){
            _oContainer.y+=evt.localY-100;
       }else{
            _oContainer.y+=evt.localY;
        }
    };
    
    this.onOver = function(evt){
       if(!s_bMobile){
            evt.target.cursor = "pointer";
        }   
    };
    
    this.onRelease = function(){
        s_oGame.onSnap(this);
    };
    
    this.getColor = function (){
       return _iColor; 
    };
    
    this.setStandardPos = function(){
        _oContainer.x = (PIECE_WIDTH*_iColor);
        _oContainer.y = 0;
    };
    
    this.getStandardX= function(){
       return  _oContainer.x = (PIECE_WIDTH*_iColor);
    };
    
    this.unload = function(){
        this.removeListener();
       _oParentContainer.removeChild(_oContainer);
    };
    
    this.removeListener = function(){
        _oContainer.off("pressmove",_pressmove);
        _oContainer.off("pressup",_pressup);
        _oContainer.off("mousedown",_mousedown);
        _oContainer.off("mouseover",_mouseover);
    };
    
    this.init(iColor,iStartPosX,iStartPosY,oParentContainer);
}